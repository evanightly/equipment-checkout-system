import { FilterFieldConfig, StandardFilters } from '@/components/standard-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import { columns, Division } from './columns';

interface DivisionIndexProps {
    divisions: PaginateResponse<Division>;
    filters: {
        search?: string;
        status?: string;
        per_page?: number;
    };
}

export default function DivisionIndex({ divisions, filters }: DivisionIndexProps) {
    // Configure filter fields for StandardFilters
    const filterFields: FilterFieldConfig[] = [
        {
            key: 'search',
            label: 'Search Divisions',
            type: 'search',
            placeholder: 'Search divisions...',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            allLabel: 'All statuses',
            options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
            ],
        },
    ];

    return (
        <AppLayout>
            <Head title='Division Management' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Division Management</h1>
                        <p className='text-muted-foreground'>Manage organizational divisions and departments</p>
                    </div>
                    <Link href={route('divisions.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Add Division
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <StandardFilters
                    fields={filterFields}
                    filters={{
                        search: filters.search,
                        status: filters.status,
                    }}
                    routeName='divisions.index'
                />

                {/* Divisions DataTable */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Building2 className='h-5 w-5' />
                            Total {divisions.total} Divisions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={divisions.data || []}
                            pagination={{
                                current_page: divisions.current_page || 1,
                                last_page: divisions.last_page || 1,
                                per_page: divisions.per_page || 10,
                                total: divisions.total || 0,
                                from: divisions.from || 0,
                                to: divisions.to || 0,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
