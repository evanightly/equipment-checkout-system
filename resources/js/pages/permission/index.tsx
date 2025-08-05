import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { columns, Permission } from './columns';

interface PermissionIndexProps {
    permissions: PaginateResponse<Permission>;
    filters: {
        search?: string;
        per_page?: number;
    };
}

export default function PermissionIndex({ permissions, filters }: PermissionIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');

        router.get(
            route('permissions.index'),
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
        router.get(route('permissions.index'));
    };

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
                                        placeholder='Search by permission name...'
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
