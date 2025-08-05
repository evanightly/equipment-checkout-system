import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { columns, Role } from './columns';

interface RoleIndexProps {
    roles: PaginateResponse<Role>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function RoleIndex({ roles, filters }: RoleIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');

        router.get(
            route('roles.index'),
            {
                search: searchTerm || undefined,
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
        router.get(route('roles.index'));
    };

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
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Search className='h-5 w-5' />
                            Search & Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
                            <div className='flex-1'>
                                <label className='mb-2 block text-sm font-medium'>Search</label>
                                <div className='relative'>
                                    <Search className='absolute top-3 left-3 h-4 w-4 text-muted-foreground' />
                                    <Input
                                        className='pl-10'
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder='Search by role name...'
                                        value={searchTerm}
                                    />
                                </div>
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
