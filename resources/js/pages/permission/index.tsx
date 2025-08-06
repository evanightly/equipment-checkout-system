import { FilterFieldConfig, StandardFilters } from '@/components/standard-filters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head } from '@inertiajs/react';
import { columns, Permission } from './columns';

interface PermissionIndexProps {
    permissions: PaginateResponse<Permission>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function PermissionIndex({ permissions, filters }: PermissionIndexProps) {
    // Configure filter fields for StandardFilters
    const filterFields: FilterFieldConfig[] = [
        {
            key: 'search',
            label: 'Search Permissions',
            type: 'search',
            placeholder: 'Search permissions...',
        },
    ];

    return (
        <AppLayout>
            <Head title='Permissions' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Permissions</h1>
                        <p className='text-muted-foreground'>Manage system permissions and view their role assignments.</p>
                    </div>
                </div>

                {/* Filters */}
                <StandardFilters
                    fields={filterFields}
                    filters={{
                        search: filters.search,
                    }}
                    routeName='permissions.index'
                />

                {/* Permissions DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle>Permissions ({permissions.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={permissions.data || []}
                            pagination={{
                                current_page: permissions.current_page || 1,
                                last_page: permissions.last_page || 1,
                                per_page: permissions.per_page || 10,
                                total: permissions.total || 0,
                                from: permissions.from || 0,
                                to: permissions.to || 0,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
