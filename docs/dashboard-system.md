# Dashboard System Documentation

## Overview

The dashboard provides a comprehensive overview of the Asset Management System with real-time statistics, interactive charts, and activity monitoring. It's designed to give administrators and users insights into equipment usage, system performance, and user activities.

## Features

### 📊 **Overview Statistics Cards**

- **Total Equipment**: Real count from database with growth percentage
- **Active Users**: Users who have logged in recently
- **Active Borrowings**: Currently borrowed equipment
- **Overdue Items**: Equipment that should have been returned

### 📈 **Interactive Charts**

1. **Equipment Added Over Time (Line Chart)**
    - Shows monthly equipment additions for the last 12 months
    - Helps track inventory growth patterns
    - Data Source: `Equipment.created_at` field

2. **Borrowing Trends (Multi-Line Chart)**
    - Daily borrowing and return activities for the last 30 days
    - Shows system usage patterns
    - Data Source: `EquipmentUser` model

3. **Equipment Type Distribution (Pie Chart)**
    - Visual breakdown of equipment by type
    - Shows which equipment categories are most common
    - Data Source: `Equipment.type` field

4. **Department Usage (Bar Chart)**
    - Equipment usage by department
    - Shows which departments are most active
    - Data Source: Cross-reference between users and borrowings

### 🔔 **System Alerts**

- **Overdue Equipment**: Automatic alerts for equipment past return date
- **Maintenance Required**: Items needing service
- **Low Stock Alerts**: Equipment running low (configurable)

### 📋 **Recent Activities Feed**

- Real-time feed of equipment borrowing and returns
- Shows user names, equipment, and timestamps
- Status indicators for active vs completed transactions

### 📊 **Additional Analytics**

- **Equipment Status Distribution**: Available, In Use, Maintenance, Damaged
- **User Analytics**: Total users, active users, new users this month
- **Activity Rates**: User engagement percentages

## Technical Implementation

### Controller Structure

```php
class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'overview' => $this->getOverviewStats(),
            'charts' => $this->getChartsData(),
            'recentActivities' => $this->getRecentActivities(),
            // ... more data
        ]);
    }
}
```

### Chart Library

- **Library**: Recharts (React-based charting library)
- **Components**: Custom wrapper components for consistent styling
- **Responsive**: All charts adapt to screen size
- **Theme Aware**: Dark/light mode support

### Data Flow

1. **Controller** gathers data from various models
2. **Fallback Strategy** provides demo data if models aren't ready
3. **Inertia.js** passes data to React frontend
4. **React Components** render interactive charts
5. **Real-time Updates** (optional) via API polling

## Chart Components

### LineChart (`CustomLineChart`)

```tsx
<CustomLineChart data={chartData} xAxisKey='month' lines={[{ dataKey: 'equipment', stroke: '#8b5cf6', name: 'Equipment Added' }]} height={300} />
```

### BarChart (`CustomBarChart`)

```tsx
<CustomBarChart data={chartData} xAxisKey='department' bars={[{ dataKey: 'usage', fill: '#8b5cf6', name: 'Usage' }]} height={300} />
```

### PieChart (`CustomPieChart`)

```tsx
<CustomPieChart data={chartData} dataKey='value' nameKey='name' height={300} colors={['#8b5cf6', '#3b82f6', '#10b981']} />
```

## Data Sources

### Real Data (Production)

- Equipment counts from `Equipment` table
- User activity from `User` and `EquipmentUser` tables
- Department statistics from `Division` table
- Borrowing patterns from `EquipmentUser` relationships

### Demo Data (Development)

- Realistic sample data when models aren't available
- Smooth development experience
- Easy testing and demonstration

## Performance Considerations

### Database Optimization

```php
// Efficient queries with proper indexing
Equipment::select('created_at')
    ->where('created_at', '>=', Carbon::now()->subMonths(12))
    ->groupBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'))
    ->get();
```

### Caching Strategy

- Cache expensive queries for 5-15 minutes
- Use Redis for better performance
- Invalidate cache on data updates

### Frontend Optimization

- Lazy loading for chart components
- Responsive data loading
- Efficient re-rendering with React optimizations

## Customization

### Adding New Charts

1. Create data method in `DashboardController`
2. Add to `getChartsData()` method
3. Create React component using chart components
4. Add to dashboard layout

### Modifying Alerts

Edit the `getSystemAlerts()` method:

```php
private function getSystemAlerts(): array
{
    $alerts = [];

    // Add your custom alert logic
    if ($customCondition) {
        $alerts[] = [
            'type' => 'warning',
            'title' => 'Custom Alert',
            'message' => 'Your custom message',
            'action' => 'Take Action',
            'url' => '/custom-url'
        ];
    }

    return $alerts;
}
```

### Custom Statistics

Add new stats to `getOverviewStats()`:

```php
[
    'title' => 'Your Custom Metric',
    'value' => $this->getCustomMetric(),
    'change' => '+X%',
    'trend' => 'up',
    'icon' => 'CustomIcon',
    'color' => 'purple'
]
```

## Future Enhancements

### Real-time Updates

- WebSocket integration for live data
- Server-sent events for activity feed
- Auto-refreshing charts

### Advanced Analytics

- Predictive analytics for equipment demand
- Usage optimization recommendations
- Cost analysis and budgeting tools

### Export Capabilities

- PDF report generation
- Excel export for charts
- Scheduled report emails

### Mobile Optimization

- Progressive Web App (PWA) support
- Touch-optimized charts
- Offline capabilities

## Troubleshooting

### Common Issues

1. **Charts not loading**
    - Check if Recharts is properly installed
    - Verify data structure matches component expectations

2. **Demo data showing in production**
    - Verify database models exist
    - Check database connections
    - Review try-catch blocks in controller

3. **Performance issues**
    - Implement query caching
    - Add database indexes
    - Optimize chart rendering

### Debug Mode

Enable debug mode in controller:

```php
// Add to controller for debugging
private $debug = true;

private function debugLog($message, $data = null)
{
    if ($this->debug) {
        \Log::info("Dashboard Debug: $message", $data ? [$data] : []);
    }
}
```

## Security Considerations

### Data Access Control

- Role-based data filtering
- Department-specific statistics
- User permission checks

### API Endpoints

- Rate limiting for real-time updates
- Authentication required
- Data sanitization

This dashboard system provides a solid foundation for monitoring and managing your broadcast equipment system with room for future expansion and customization.
