import { StandardFilters } from '@/components/standard-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { Equipment, EquipmentUser } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, History, Plus, XCircle } from 'lucide-react';
import { columns } from './columns';

interface Props {
    borrowings: {
        data: EquipmentUser[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    availableEquipment: Equipment[];
    filters: {
        search?: string;
        status?: string;
    };
    canManageBorrowings: boolean;
}

export default function BorrowingIndex({ borrowings, filters, canManageBorrowings }: Props) {
    // Calculate statistics
    const pendingCount = borrowings.data.filter((b) => b.status === 'pending').length;
    const approvedCount = borrowings.data.filter((b) => b.status === 'approved').length;
    const overdueCount = borrowings.data.filter((b) => {
        return b.status === 'approved' && new Date(b.due_date) < new Date();
    }).length;
    const returnedCount = borrowings.data.filter((b) => b.status === 'returned').length;

    return (
        <AppLayout>
            <Head title='Borrowing Management' />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>Borrowing Management</h1>
                        <p className='text-muted-foreground'>Manage equipment borrowing requests and returns</p>
                    </div>
                    <Button asChild>
                        <Link href={route('equipment-users.create')}>
                            <Plus className='mr-2 h-4 w-4' />
                            New Borrowing Request
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Requests</CardTitle>
                            <History className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{borrowings.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Pending Approval</CardTitle>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-yellow-600'>{pendingCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Currently Borrowed</CardTitle>
                            <CheckCircle className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-blue-600'>{approvedCount}</div>
                            {overdueCount > 0 && <p className='mt-1 text-xs text-red-600'>{overdueCount} overdue</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Returned</CardTitle>
                            <XCircle className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-green-600'>{returnedCount}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <StandardFilters
                    fields={[
                        {
                            key: 'search',
                            label: 'Search',
                            type: 'search',
                            placeholder: 'Search borrowings...',
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            type: 'select',
                            allLabel: 'All statuses',
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'approved', label: 'Approved' },
                                { value: 'cancelled', label: 'Cancelled' },
                                { value: 'returned', label: 'Returned' },
                            ],
                        },
                    ]}
                    filters={filters}
                    routeName='equipment-users.index'
                />

                {/* Quick Actions for Admins */}
                {canManageBorrowings && pendingCount > 0 && (
                    <Card className='border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'>
                        <CardHeader>
                            <CardTitle className='flex items-center text-yellow-800 dark:text-yellow-200'>
                                <Clock className='mr-2 h-5 w-5' />
                                Pending Approvals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-yellow-700 dark:text-yellow-300'>
                                You have {pendingCount} borrowing request{pendingCount !== 1 ? 's' : ''} waiting for approval.
                            </p>
                            <Button
                                className='mt-3'
                                onClick={() => {
                                    // This will be handled by StandardFilters component
                                    window.location.href = route('equipment-users.index', { status: 'pending' });
                                }}
                                size='sm'
                                variant='outline'
                            >
                                View Pending Requests
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Overdue Alert for Admins */}
                {canManageBorrowings && overdueCount > 0 && (
                    <Card className='border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'>
                        <CardHeader>
                            <CardTitle className='flex items-center text-red-800 dark:text-red-200'>
                                <XCircle className='mr-2 h-5 w-5' />
                                Overdue Equipment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-red-700 dark:text-red-300'>
                                {overdueCount} piece{overdueCount !== 1 ? 's' : ''} of equipment {overdueCount !== 1 ? 'are' : 'is'} overdue for
                                return.
                            </p>
                            <Button
                                className='mt-3'
                                onClick={() => {
                                    window.location.href = route('equipment-users.index', { status: 'approved' });
                                }}
                                size='sm'
                                variant='outline'
                            >
                                View Overdue Items
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Borrowings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Borrowing Requests ({borrowings.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={borrowings.data}
                            pagination={{
                                current_page: borrowings.current_page,
                                last_page: borrowings.last_page,
                                per_page: borrowings.per_page,
                                total: borrowings.total,
                                from: borrowings.from,
                                to: borrowings.to,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
