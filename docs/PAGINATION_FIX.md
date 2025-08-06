# Per-Page Pagination Fix

## Issues Identified and Fixed:

### 1. **Backend Issue: Hardcoded Pagination**

- **Problem**: UserController was hardcoded to `paginate(10)` regardless of request parameters
- **Fix**: Updated to accept and validate `per_page` parameter
- **Code Changes**:

    ```php
    // Before
    ->paginate(10)

    // After
    $perPage = $request->input('per_page', 10);
    $perPage = in_array($perPage, [10, 20, 30, 40, 50]) ? $perPage : 10;
    ->paginate($perPage)
    ```

### 2. **Frontend Issue: Search Not Preserving Per-Page**

- **Problem**: When searching/filtering, the `per_page` parameter was lost
- **Fix**: Updated `handleSearch()` to preserve current `per_page` from URL
- **Code Changes**:
    ```tsx
    const handleSearch = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');

        router.get(
            route('users.index'),
            {
                search: searchTerm || undefined,
                role: selectedRole === 'all' ? undefined : selectedRole,
                per_page: currentPerPage || undefined, // 👈 Added this
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
    ```

### 3. **Type Safety Issue**

- **Problem**: TypeScript interface didn't include `per_page` in filters
- **Fix**: Updated `UserIndexProps` interface
- **Code Changes**:
    ```tsx
    filters: {
        search?: string;
        role?: string;
        per_page?: number; // 👈 Added this
    };
    ```

### 4. **Backend Filter Response**

- **Problem**: Backend wasn't passing back the `per_page` value to frontend
- **Fix**: Updated controller to include `per_page` in filters response
- **Code Changes**:
    ```php
    'filters' => [
        'search' => $request->search,
        'role' => $request->role,
        'per_page' => $perPage, // 👈 Added this
    ],
    ```

## How It Now Works:

1. **URL Parameter Handling**: `?per_page=50` is properly read by backend
2. **Validation**: Only allows valid values (10, 20, 30, 40, 50)
3. **State Preservation**: Search/filter actions preserve the current per_page setting
4. **Select Synchronization**: The dropdown shows the correct current value
5. **Table Display**: Actually shows the requested number of rows per page

## Test Cases:

✅ **Test 1**: Navigate to `/users?per_page=50`

- Should show 50 rows (if available)
- Select dropdown should show "50"

✅ **Test 2**: Change per-page from dropdown

- Should reload page with new per_page value
- Should reset to page 1
- Should preserve search/filter terms

✅ **Test 3**: Search while on per_page=50

- Should maintain 50 rows per page after search
- Should keep per_page=50 in URL

✅ **Test 4**: Invalid per_page values

- `/users?per_page=999` should fallback to 10
- `/users?per_page=abc` should fallback to 10

All issues have been resolved and the pagination now works correctly with Inertia.js!
