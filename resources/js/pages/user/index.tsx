import { FilterFieldConfig, StandardFilters } from '@/components/standard-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns, User } from './columns';

interface UserIndexProps {
    users: PaginateResponse<User>;
    roles: Array<{
        value: string;
        label: string;
    }>;
    filters: {
        search?: string;
        role?: string;
        per_page?: number;
    };
}

export default function UserIndex({ users, roles, filters }: UserIndexProps) {
    // Configure filter fields for StandardFilters
    const filterFields: FilterFieldConfig[] = [
        {
            key: 'search',
            label: 'Search Users',
            type: 'search',
            placeholder: 'Search users...',
        },
        {
            key: 'role',
            label: 'Role',
            type: 'select',
            allLabel: 'All roles',
            options: roles,
        },
    ];

    return (
        <AppLayout>
            <Head title='User Management' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>User Management</h1>
                        <p className='text-muted-foreground'>Manage system users and their roles</p>
                    </div>
                    <Link href={route('users.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Add User
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <StandardFilters
                    fields={filterFields}
                    filters={{
                        search: filters.search,
                        role: filters.role,
                    }}
                    routeName='users.index'
                />

                {/* Users DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle>Total {users.total} Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={users.data || []}
                            pagination={{
                                current_page: users.current_page || 1,
                                last_page: users.last_page || 1,
                                per_page: users.per_page || 10,
                                total: users.total || 0,
                                from: users.from || 0,
                                to: users.to || 0,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
