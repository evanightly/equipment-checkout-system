import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Division, Equipment } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
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
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [type, setType] = useState(filters.type || 'all');
    const [divisionId, setDivisionId] = useState(filters.division_id || 'all');

    const handleSearch = () => {
        router.get(
            route('equipment.index'),
            {
                search: search || undefined,
                status: status !== 'all' ? status : undefined,
                type: type !== 'all' ? type : undefined,
                division_id: divisionId !== 'all' ? divisionId : undefined,
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
        setType('all');
        setDivisionId('all');
        router.get(route('equipment.index'), {}, { replace: true });
    };

    const hasActiveFilters = search || status !== 'all' || type !== 'all' || divisionId !== 'all';

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
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center'>
                            <Filter className='mr-2 h-4 w-4' />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
                            <div className='relative'>
                                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                <Input
                                    className='pl-9'
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder='Search equipment...'
                                    value={search}
                                />
                            </div>
                            <Select onValueChange={setStatus} value={status}>
                                <SelectTrigger>
                                    <SelectValue placeholder='All statuses' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All statuses</SelectItem>
                                    {statuses.map((statusOption) => (
                                        <SelectItem key={statusOption.value} value={statusOption.value}>
                                            {statusOption.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setType} value={type}>
                                <SelectTrigger>
                                    <SelectValue placeholder='All types' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All types</SelectItem>
                                    {types.map((typeOption) => (
                                        <SelectItem key={typeOption} value={typeOption}>
                                            {typeOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setDivisionId} value={divisionId}>
                                <SelectTrigger>
                                    <SelectValue placeholder='All divisions' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All divisions</SelectItem>
                                    {divisions.map((division) => (
                                        <SelectItem key={division.id} value={division.id.toString()}>
                                            {division.name}
                                        </SelectItem>
                                    ))}
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
                                        Status: {statuses.find((s) => s.value === status)?.name}
                                    </Badge>
                                )}
                                {type && (
                                    <Badge className='flex items-center gap-1' variant='secondary'>
                                        Type: {type}
                                    </Badge>
                                )}
                                {divisionId && (
                                    <Badge className='flex items-center gap-1' variant='secondary'>
                                        Division: {divisions.find((d) => d.id.toString() === divisionId)?.name}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

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
