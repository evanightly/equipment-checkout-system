import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
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
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');

        router.get(
            route('divisions.index'),
            {
                search: searchTerm || undefined,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                per_page: currentPerPage || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        router.get(route('divisions.index'));
    };

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
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Filter className='h-5 w-5' />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-end gap-4'>
                            <div className='flex-1'>
                                <label className='mb-2 block text-sm font-medium'>Search</label>
                                <div className='relative'>
                                    <Search className='absolute top-3 left-3 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        className='pl-10'
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder='Search by name, code, or description...'
                                        value={searchTerm}
                                    />
                                </div>
                            </div>
                            <div className='w-48'>
                                <label className='mb-2 block text-sm font-medium'>Status</label>
                                <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='All statuses' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All statuses</SelectItem>
                                        <SelectItem value='active'>Active</SelectItem>
                                        <SelectItem value='inactive'>Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex gap-2'>
                                <Button onClick={handleSearch}>
                                    <Search className='mr-2 h-4 w-4' />
                                    Search
                                </Button>
                                <Button onClick={handleClearFilters} variant='outline'>
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
