import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InertiaDataTable } from '@/components/ui/inertia-data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PaginateResponse } from '@/support/interfaces/others';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
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
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');

    const handleSearch = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPerPage = urlParams.get('per_page');

        router.get(
            route('users.index'),
            {
                search: searchTerm || undefined,
                role: selectedRole === 'all' ? undefined : selectedRole,
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
        setSelectedRole('all');
        router.get(route('users.index'));
    };

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
                                        placeholder='Search by name or email...'
                                        value={searchTerm}
                                    />
                                </div>
                            </div>
                            <div className='w-48'>
                                <label className='mb-2 block text-sm font-medium'>Role</label>
                                <Select onValueChange={setSelectedRole} value={selectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder='All roles' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='all'>All roles</SelectItem>
                                        {roles.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
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
