import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Shield, Users } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
    users: User[];
}

interface RoleShowProps {
    role: Role;
}

export default function RoleShow({ role }: RoleShowProps) {
    // Group permissions by category
    const groupedPermissions = role.permissions.reduce(
        (acc, permission) => {
            const category = permission.name.split('_')[0];
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        },
        {} as Record<string, Permission[]>,
    );

    return (
        <AppLayout>
            <Head title={`Role: ${role.name}`} />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={route('roles.index')}>
                            <Button size='sm' variant='outline'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Roles
                            </Button>
                        </Link>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight'>Role Details</h1>
                            <p className='text-muted-foreground'>View role information, permissions, and assigned users.</p>
                        </div>
                    </div>
                    <Link href={route('roles.edit', role.id)}>
                        <Button>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit Role
                        </Button>
                    </Link>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {/* Role Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Role Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Role Name</label>
                                <Badge className='mt-1 block w-fit' variant='outline'>
                                    {role.name}
                                </Badge>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Guard</label>
                                <p className='mt-1 text-sm'>{role.guard_name}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Created At</label>
                                <p className='mt-1 text-sm'>{new Date(role.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Updated At</label>
                                <p className='mt-1 text-sm'>{new Date(role.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Permissions ({role.permissions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {role.permissions.length > 0 ? (
                                <div className='space-y-4'>
                                    {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                        <div key={category}>
                                            <h4 className='mb-2 text-sm font-medium text-muted-foreground capitalize'>{category} Permissions</h4>
                                            <div className='flex flex-wrap gap-2'>
                                                {permissions.map((permission) => (
                                                    <Link href={route('permissions.show', permission.id)} key={permission.id}>
                                                        <Badge className='cursor-pointer text-xs hover:bg-secondary/80' variant='secondary'>
                                                            {permission.name.replace(/_/g, ' ').toLowerCase()}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='py-8 text-center'>
                                    <Shield className='mx-auto h-12 w-12 text-muted-foreground/50' />
                                    <p className='mt-2 text-sm text-muted-foreground'>No permissions assigned to this role.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Assigned Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Users className='h-5 w-5' />
                                Assigned Users ({role.users.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {role.users.length > 0 ? (
                                <div className='space-y-3'>
                                    {role.users.map((user) => (
                                        <div className='flex items-center justify-between rounded-lg border p-3' key={user.id}>
                                            <div>
                                                <p className='text-sm font-medium'>{user.name}</p>
                                                <p className='text-xs text-muted-foreground'>{user.email}</p>
                                            </div>
                                            <Link href={route('users.show', user.id)}>
                                                <Button size='sm' variant='ghost'>
                                                    View User
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='py-8 text-center'>
                                    <Users className='mx-auto h-12 w-12 text-muted-foreground/50' />
                                    <p className='mt-2 text-sm text-muted-foreground'>No users assigned to this role.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
