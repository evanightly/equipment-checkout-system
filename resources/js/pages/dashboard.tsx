import { motion } from 'framer-motion';
import { Activity, AlertTriangle, BarChart3, Clock, Package, Settings, TrendingUp, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomBarChart } from '@/components/ui/charts/bar-chart';
import { CustomLineChart } from '@/components/ui/charts/line-chart';
import { CustomPieChart } from '@/components/ui/charts/pie-chart';
import { StatsCard } from '@/components/ui/stats-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface DashboardPageProps extends SharedData {
    overview: Array<{
        title: string;
        value: number;
        change: string;
        trend: 'up' | 'down' | 'stable';
        icon: string;
        color: 'blue' | 'green' | 'orange' | 'red';
    }>;
    charts: {
        equipmentAddedOverTime: Array<{ month: string; equipment: number }>;
        borrowingTrends: Array<{ date: string; borrowings: number; returns: number }>;
        equipmentTypeDistribution: Array<{ type: string; count: number; percentage: number }>;
        userActivityChart: Array<{ day: string; logins: number }>;
        departmentUsageChart: Array<{ department: string; users: number; equipment_usage: number }>;
    };
    recentActivities: Array<{
        id: number;
        user: string;
        equipment: string;
        action: string;
        time: string;
        status: string;
    }>;
    equipmentStatus: Array<{ status: string; count: number }>;
    userAnalytics: {
        total: number;
        active: number;
        new_this_month: number;
        activity_rate: number;
    };
    departmentStats: Array<{
        name: string;
        users: number;
        equipment_count: number;
    }>;
    alerts: Array<{
        type: 'warning' | 'info' | 'error';
        title: string;
        message: string;
        action: string;
        url: string;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Icon mapping
const iconMap: Record<string, any> = {
    Package,
    Users,
    Clock,
    AlertTriangle,
};

export default function Dashboard() {
    const { overview, charts, recentActivities, equipmentStatus, userAnalytics, alerts } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Dashboard' />
            <div className='flex h-full flex-1 flex-col gap-6 p-6'>
                {/* Overview Stats */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {overview.map((stat, index) => {
                        const IconComponent = iconMap[stat.icon] || Package;
                        return (
                            <StatsCard
                                change={stat.change}
                                color={stat.color}
                                delay={index * 0.1}
                                icon={IconComponent}
                                key={stat.title}
                                title={stat.title}
                                trend={stat.trend}
                                value={stat.value.toLocaleString()}
                            />
                        );
                    })}
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='grid gap-4'
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className='text-lg font-semibold'>System Alerts</h2>
                        <div className='grid gap-3'>
                            {alerts.map((alert, index) => (
                                <Card
                                    className={`border-l-4 ${
                                        alert.type === 'error'
                                            ? 'border-l-red-500'
                                            : alert.type === 'warning'
                                              ? 'border-l-orange-500'
                                              : 'border-l-blue-500'
                                    }`}
                                    key={index}
                                >
                                    <CardContent className='flex items-center justify-between p-4'>
                                        <div>
                                            <h3 className='font-medium'>{alert.title}</h3>
                                            <p className='text-sm text-muted-foreground'>{alert.message}</p>
                                        </div>
                                        <Link className={buttonVariants({ variant: 'outline', size: 'sm' })} href={alert.url}>
                                            {alert.action}
                                        </Link>
                                        {/* <Button size='sm' variant='outline'>
                                            {alert.action}
                                        </Button> */}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Charts Grid */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Equipment Added Over Time */}
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <TrendingUp className='h-5 w-5' />
                                    Equipment Added Over Time
                                </CardTitle>
                                <CardDescription>Monthly equipment additions to the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomLineChart
                                    data={charts.equipmentAddedOverTime}
                                    height={300}
                                    lines={[
                                        {
                                            dataKey: 'equipment',
                                            stroke: '#8b5cf6',
                                            name: 'Equipment Added',
                                        },
                                    ]}
                                    showLegend={false}
                                    xAxisKey='month'
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Borrowing Trends */}
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.6 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Activity className='h-5 w-5' />
                                    Borrowing Trends (Last 30 Days)
                                </CardTitle>
                                <CardDescription>Daily borrowing and return activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomLineChart
                                    data={charts.borrowingTrends}
                                    height={300}
                                    lines={[
                                        {
                                            dataKey: 'borrowings',
                                            stroke: '#3b82f6',
                                            name: 'Borrowings',
                                        },
                                        {
                                            dataKey: 'returns',
                                            stroke: '#10b981',
                                            name: 'Returns',
                                        },
                                    ]}
                                    xAxisKey='date'
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Equipment Type Distribution */}
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <BarChart3 className='h-5 w-5' />
                                    Equipment Type Distribution
                                </CardTitle>
                                <CardDescription>Distribution of equipment by type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomPieChart
                                    colors={['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                                    data={charts.equipmentTypeDistribution.map((item) => ({
                                        name: item.type,
                                        value: item.count,
                                    }))}
                                    dataKey='value'
                                    height={300}
                                    nameKey='name'
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Department Usage */}
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.8 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Users className='h-5 w-5' />
                                    Department Usage
                                </CardTitle>
                                <CardDescription>Equipment usage by department</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CustomBarChart
                                    bars={[
                                        {
                                            dataKey: 'equipment_usage',
                                            fill: '#8b5cf6',
                                            name: 'Equipment Usage',
                                        },
                                    ]}
                                    data={charts.departmentUsageChart}
                                    height={300}
                                    showLegend={false}
                                    xAxisKey='department'
                                />
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                    {/* Recent Activities */}
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className='lg:col-span-2'
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Clock className='h-5 w-5' />
                                    Recent Activities
                                </CardTitle>
                                <CardDescription>Latest equipment borrowing and return activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-4'>
                                    {recentActivities.map((activity) => (
                                        <div className='flex items-center justify-between border-b pb-3 last:border-b-0' key={activity.id}>
                                            <div className='flex items-center space-x-3'>
                                                <div className='flex-1'>
                                                    <p className='text-sm font-medium'>
                                                        {activity.user} {activity.action} {activity.equipment}
                                                    </p>
                                                    <p className='text-xs text-muted-foreground'>{activity.time}</p>
                                                </div>
                                            </div>
                                            <Badge variant={activity.status === 'active' ? 'default' : 'secondary'}>{activity.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Equipment Status */}
                    <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 1.0 }}>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Settings className='h-5 w-5' />
                                    Equipment Status
                                </CardTitle>
                                <CardDescription>Current status of all equipment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    {equipmentStatus.map((status, index) => (
                                        <div className='flex items-center justify-between' key={index}>
                                            <span className='text-sm font-medium'>{status.status}</span>
                                            <Badge variant='outline'>{status.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Analytics */}
                        <Card className='mt-6'>
                            <CardHeader>
                                <CardTitle>User Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-sm'>Total Users</span>
                                        <span className='font-medium'>{userAnalytics.total}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm'>Active Users</span>
                                        <span className='font-medium'>{userAnalytics.active}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm'>New This Month</span>
                                        <span className='font-medium'>{userAnalytics.new_this_month}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-sm'>Activity Rate</span>
                                        <Badge>{userAnalytics.activity_rate}%</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
