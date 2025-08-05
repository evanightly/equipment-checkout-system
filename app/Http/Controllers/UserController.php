<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Middleware\PermissionMiddleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(PermissionMiddleware::using(PermissionEnum::USER_READ->value)),
            new Middleware(PermissionMiddleware::using(PermissionEnum::USER_CREATE->value), only: ['create', 'store']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::USER_UPDATE->value), only: ['edit', 'update']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::USER_DELETE->value), only: ['destroy']),
        ];
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 10);

        // Validate per_page to prevent abuse
        $perPage = in_array($perPage, [10, 20, 30, 40, 50]) ? $perPage : 10;

        $users = User::query()
            ->with(['roles'])
            ->when($request->search, function ($query, $search) {
                $query->search($search);
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $roles = collect(RoleEnum::cases())->map(function ($role) {
            return [
                'value' => $role->value,
                'label' => $role->value, // Use role name instead of description for filter
            ];
        });

        return Inertia::render('user/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $roles = collect(RoleEnum::cases())->map(function ($role) {
            return [
                'value' => $role->value,
                'label' => $role->value,
                'permissions' => collect($role->getPermissions())->map(fn ($perm) => $perm->value),
            ];
        });

        return Inertia::render('user/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'nip' => $request->nip,
        ]);

        // Assign role if provided
        if ($request->role && $request->role !== 'no-role') {
            $user->assignRole($request->role);
        }

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load(['roles.permissions']);

        return Inertia::render('user/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load(['roles']);

        $roles = collect(RoleEnum::cases())->map(function ($role) {
            return [
                'value' => $role->value,
                'label' => $role->value,
                'permissions' => collect($role->getPermissions())->map(fn ($perm) => $perm->value),
            ];
        });

        return Inertia::render('user/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'nip' => $request->nip,
        ];

        // Only update password if provided
        if ($request->password) {
            $userData['password'] = bcrypt($request->password);
        }

        $user->update($userData);

        // Sync roles
        if ($request->role && $request->role !== 'no-role') {
            $user->syncRoles([$request->role]);
        } else {
            $user->syncRoles([]);
        }

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }
}
