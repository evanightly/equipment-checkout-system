import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Equipment, EquipmentUser } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Clock, Filter, History, Plus, Search, XCircle } from 'lucide-react';
import { useState } from 'react';
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
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(
            route('equipment-users.index'),
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        router.get(route('equipment-users.index'), {}, { replace: true });
    };

    const hasActiveFilters = search || status !== 'all';

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
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Filter className='mr-2 h-4 w-4' />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4 md:grid-cols-4'>
                            <div className='relative md:col-span-2'>
                                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                <Input
                                    className='pl-9'
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder='Search borrowings...'
                                    value={search}
                                />
                            </div>
                            <Select onValueChange={setStatus} value={status}>
                                <SelectTrigger>
                                    <SelectValue placeholder='All statuses' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All statuses</SelectItem>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='approved'>Approved</SelectItem>
                                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                                    <SelectItem value='returned'>Returned</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className='flex space-x-2'>
                                <Button onClick={handleSearch} size='sm'>
                                    Search
                                </Button>
                                {hasActiveFilters && (
                                    <Button onClick={clearFilters} size='sm' variant='outline'>
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className='mt-4 flex flex-wrap gap-2'>
                                {search && (
                                    <Badge className='flex items-center gap-1' variant='secondary'>
                                        Search: {search}
                                    </Badge>
                                )}
                                {status && (
                                    <Badge className='flex items-center gap-1' variant='secondary'>
                                        Status: {status}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                                    setStatus('pending');
                                    handleSearch();
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
                                    setStatus('approved');
                                    handleSearch();
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
