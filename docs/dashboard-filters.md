# Dashboard Filters Documentation

## Overview

The dashboard now includes comprehensive filtering capabilities that allow users to filter charts and data visualizations based on various criteria. This feature enhances the user experience by providing focused views of the data.

## Filter Features

### 1. Filter Controls Panel

- **Location**: Located between the overview stats and alerts
- **Toggle**: Show/Hide filters with a collapsible interface
- **Visual Indicator**: "Active" badge appears when any filter is applied
- **Reset**: One-click reset button to clear all filters

### 2. Available Filters

#### Date Range Filter

- **Options**:
    - Last 7 days
    - Last 30 days (default)
    - Last 3 months
    - Last 6 months
    - Last year
- **Affects**:
    - Equipment Added Over Time chart
    - Borrowing Trends chart

#### Equipment Type Filter

- **Options**: Dynamically populated from available equipment types
- **Default**: All Types
- **Affects**:
    - Equipment Type Distribution chart

#### Department Filter

- **Options**: Dynamically populated from available departments
- **Default**: All Departments
- **Affects**:
    - Department Usage chart

#### Status Filter

- **Options**:
    - All Statuses (default)
    - Available
    - In Use
    - Maintenance
    - Damaged
- **Affects**:
    - Recent Activities list

### 3. Filter State Management

The filter system uses React state to manage filter preferences:

```typescript
const [filters, setFilters] = useState({
    dateRange: '30', // days
    equipmentType: 'all',
    department: 'all',
    status: 'all',
    showFilters: false, // controls panel visibility
});
```

### 4. Dynamic Data Filtering

#### Chart Data Filtering

All chart data is filtered using `useMemo` hooks for optimal performance:

- **Equipment Added Over Time**: Filtered by date range (shows last N months)
- **Borrowing Trends**: Filtered by date range (shows last N days)
- **Equipment Type Distribution**: Filtered by equipment type
- **Department Usage**: Filtered by department
- **Recent Activities**: Filtered by status

#### Filter Indicators

Each filtered chart shows contextual information:

- Display count: "Showing X of Y items" when filters are active
- Color-coded indicators in blue to highlight filtered state
- Empty state messages when no data matches filters

### 5. Active Filter Display

Below the filter controls, active filters are displayed as badges:

- **Date Range**: Shows selected time period if not default
- **Equipment Type**: Shows selected type if not "all"
- **Department**: Shows selected department if not "all"
- **Status**: Shows selected status if not "all"

## Technical Implementation

### Filter Logic

```typescript
// Filter equipment types
if (filters.equipmentType !== 'all') {
    filteredData.equipmentTypeDistribution = filteredData.equipmentTypeDistribution.filter((item) => item.type === filters.equipmentType);
}

// Filter by date range
if (filters.dateRange !== '365') {
    const daysToShow = parseInt(filters.dateRange);
    const monthsToShow = Math.ceil(daysToShow / 30);
    filteredData.equipmentAddedOverTime = filteredData.equipmentAddedOverTime.slice(-monthsToShow);
}
```

### Performance Optimization

- Uses `useMemo` hooks to prevent unnecessary recalculations
- Filters are only applied when dependencies change
- Efficient array operations for data transformation

### UI Components Used

- **Select**: For dropdown filters
- **Button**: For toggle and reset actions
- **Badge**: For active filter indicators and status display
- **Label**: For filter field labels
- **Card**: For filter panel container

## User Experience Features

### 1. Progressive Disclosure

- Filters are hidden by default to reduce visual clutter
- Easy toggle to show/hide filter controls
- Intuitive "Show Filters" / "Hide Filters" button text

### 2. Visual Feedback

- Active filter badge in panel header
- Filter count indicators on charts
- Active filter badges below controls
- Empty states with helpful messages

### 3. Easy Reset

- One-click reset button clears all filters
- Returns to default view quickly
- Consistent reset behavior across all filters

### 4. Responsive Design

- Filter controls adapt to screen size
- Grid layout: 1 column on mobile, 2 on tablet, 4 on desktop
- Proper spacing and alignment

## Filter Effects on Charts

### Equipment Added Over Time

- **Before**: Shows all 12 months of data
- **After**: Shows data for selected time period
- **Indicator**: "(Showing X of Y months)"

### Borrowing Trends

- **Before**: Shows last 30 days
- **After**: Shows selected date range
- **Indicator**: "(Showing X of Y days)"

### Equipment Type Distribution

- **Before**: Shows all equipment types
- **After**: Shows only selected type(s)
- **Indicator**: "(Showing X of Y types)"

### Department Usage

- **Before**: Shows all departments
- **After**: Shows only selected department(s)
- **Indicator**: "(Showing X of Y departments)"

### Recent Activities

- **Before**: Shows all recent activities
- **After**: Shows activities matching status filter
- **Indicator**: "(Showing X of Y activities)"
- **Empty State**: Custom message with clock icon

## Future Enhancements

### Potential Additions

1. **Date Range Picker**: Custom date selection instead of preset ranges
2. **Multiple Selection**: Allow selecting multiple equipment types/departments
3. **Search Filters**: Text-based filtering for equipment names
4. **Save Filter Presets**: Allow users to save frequently used filter combinations
5. **URL Persistence**: Save filter state in URL for sharing/bookmarking
6. **Export Filtered Data**: Download filtered chart data as CSV/Excel

### Backend Integration

- Currently uses client-side filtering
- Could be enhanced with server-side filtering for better performance
- API endpoints could accept filter parameters
- Pagination support for large datasets

## Accessibility

### Keyboard Navigation

- All filter controls are keyboard accessible
- Proper tab order through filter controls
- Enter/Space key support for buttons

### Screen Readers

- Proper ARIA labels on all controls
- Descriptive button text
- Form field associations with labels

### Visual Design

- Sufficient color contrast
- Clear visual hierarchy
- Consistent spacing and alignment
- Loading states and feedback

## Testing Recommendations

### Unit Tests

- Filter state management
- Data filtering logic
- Component rendering with different filter states

### Integration Tests

- Filter interactions with charts
- Reset functionality
- Multiple filter combinations

### User Acceptance Tests

- Filter discovery and usage
- Performance with large datasets
- Mobile responsiveness
- Accessibility compliance

## Conclusion

The dashboard filter system provides a powerful and user-friendly way to explore equipment management data. The implementation balances functionality with performance, ensuring a smooth user experience while providing comprehensive filtering capabilities.

The modular design makes it easy to extend with additional filter types and enhance with more advanced features as the application grows.
