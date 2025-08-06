import { FilterFieldConfig, StandardFilters } from '@/components/standard-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import AppLayout from '@/layouts/app-layout';
import { Division, Equipment } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

interface Props {
    equipment: {
        data: Equipment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    divisions: Division[];
    types: string[];
    filters: {
        search?: string;
        status?: string;
        type?: string;
        division_id?: string;
    };
    statuses: Array<{
        name: string;
        value: string;
    }>;
}

export default function EquipmentIndex({ equipment, divisions, types, filters, statuses }: Props) {
    console.log(equipment);
    
    // Configure filter fields for StandardFilters
    const filterFields: FilterFieldConfig[] = [
        {
            key: 'search',
            label: 'Search Equipment',
            type: 'search',
            placeholder: 'Search equipment...',
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            allLabel: 'All statuses',
            options: statuses.map((status) => ({
                value: status.value,
                label: status.name,
            })),
        },
        {
            key: 'type',
            label: 'Type',
            type: 'select',
            allLabel: 'All types',
            options: types.map((type) => ({
                value: type,
                label: type,
            })),
        },
        {
            key: 'division_id',
            label: 'Division',
            type: 'select',
            allLabel: 'All divisions',
            options: divisions.map((division) => ({
                value: division.id.toString(),
                label: division.name,
            })),
        },
    ];

    return (
        <AppLayout>
            <Head title='Equipment Management' />

            <div className='flex flex-col space-y-6 p-4'>
                {/* Header */}
                <div className='flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight'>Equipment Management</h1>
                        <p className='text-muted-foreground'>Manage and track all equipment in your organization</p>
                    </div>
                    <Button asChild>
                        <Link href={route('equipment.create')}>
                            <Plus className='mr-2 h-4 w-4' />
                            Add Equipment
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Total Equipment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{equipment.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-green-600'>{equipment.data.filter((eq) => eq.status === 'available').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Borrowed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-blue-600'>{equipment.data.filter((eq) => eq.status === 'borrowed').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>Maintenance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-yellow-600'>
                                {equipment.data.filter((eq) => eq.status === 'maintenance').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <StandardFilters fields={filterFields} filters={filters} routeName='equipment.index' />

                {/* Equipment Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Equipment ({equipment.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <InertiaDataTable
                            columns={columns}
                            data={equipment.data}
                            pagination={{
                                current_page: equipment.current_page,
                                last_page: equipment.last_page,
                                per_page: equipment.per_page,
                                total: equipment.total,
                                from: (equipment.current_page - 1) * equipment.per_page + 1,
                                to: Math.min(equipment.current_page * equipment.per_page, equipment.total),
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
