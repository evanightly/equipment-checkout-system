import { FilterFieldConfig, StandardFilters } from '@/components/standard-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns, Role } from './columns';

interface RoleIndexProps {
    roles: PaginateResponse<Role>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function RoleIndex({ roles, filters }: RoleIndexProps) {
    // Configure filter fields for StandardFilters
    const filterFields: FilterFieldConfig[] = [
        {
            key: 'search',
            label: 'Search Roles',
            type: 'search',
            placeholder: 'Search roles...',
        },
    ];

    return (
        <AppLayout>
            <Head title='Roles' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Roles</h1>
                        <p className='text-muted-foreground'>Manage system roles and their permissions.</p>
                    </div>
                    <Link href={route('roles.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Create Role
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <StandardFilters
                    fields={filterFields}
                    filters={{
                        search: filters.search,
                    }}
                    routeName='roles.index'
                />

                {/* Roles DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle>Roles ({roles.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={roles.data || []}
                            pagination={{
                                current_page: roles.current_page || 1,
                                last_page: roles.last_page || 1,
                                per_page: roles.per_page || 10,
                                total: roles.total || 0,
                                from: roles.from || 0,
                                to: roles.to || 0,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
