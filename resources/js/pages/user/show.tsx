import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, IdCard, Mail, Shield } from 'lucide-react';
import React from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface User {
    id: number;
    name: string;
    email: string;
    nip?: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

interface Props {
    user: User;
}

const ShowUser: React.FC<Props> = ({ user }) => {
    const getRoleBadgeVariant = (roleName: string) => {
        switch (roleName) {
            case 'SuperAdmin':
                return 'destructive' as const;
            case 'Admin':
                return 'default' as const;
            case 'Viewer':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <AppLayout>
            <Head title={`User - ${user.name}`} />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={route('users.index')}>
                            <Button size='sm' variant='ghost'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Users
                            </Button>
                        </Link>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight'>{user.name}</h1>
                            <p className='text-muted-foreground'>User details and permissions</p>
                        </div>
                    </div>
                    <Link href={route('users.edit', user.id)}>
                        <Button>
                            <Edit className='mr-2 h-4 w-4' />
                            Edit User
                        </Button>
                    </Link>
                </div>

                <div className='grid max-w-6xl gap-6 md:grid-cols-2'>
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <IdCard className='h-5 w-5' />
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Name</label>
                                <p className='text-lg font-medium'>{user.name}</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Mail className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Email</label>
                                    <p className='font-medium'>{user.email}</p>
                                </div>
                            </div>

                            {user.nip && (
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>NIP</label>
                                    <code className='block rounded bg-muted px-3 py-2 font-mono text-sm'>{user.nip}</code>
                                </div>
                            )}

                            <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Created</label>
                                    <p className='font-medium'>
                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4 text-muted-foreground' />
                                <div>
                                    <label className='text-sm font-medium text-muted-foreground'>Last Updated</label>
                                    <p className='font-medium'>
                                        {new Date(user.updated_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles and Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Roles & Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Roles */}
                            <div>
                                <label className='mb-2 block text-sm font-medium text-muted-foreground'>Assigned Roles</label>
                                <div className='flex flex-wrap gap-2'>
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <Badge className='text-sm' key={role.id} variant={getRoleBadgeVariant(role.name)}>
                                                {role.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <Badge className='text-sm' variant='outline'>
                                            No roles assigned
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Permissions */}
                            {user.roles.length > 0 && (
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-muted-foreground'>Permissions</label>
                                    <div className='space-y-3'>
                                        {user.roles.map((role) => (
                                            <div className='rounded-lg border p-3' key={role.id}>
                                                <div className='mb-2 flex items-center gap-2'>
                                                    <Badge className='text-xs' variant={getRoleBadgeVariant(role.name)}>
                                                        {role.name}
                                                    </Badge>
                                                    <span className='text-sm text-muted-foreground'>({role.permissions.length} permissions)</span>
                                                </div>
                                                <div className='flex flex-wrap gap-1'>
                                                    {role.permissions.map((permission) => (
                                                        <Badge className='text-xs' key={permission.id} variant='outline'>
                                                            {permission.name.replace('_', ' ').toLowerCase()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user.roles.length === 0 && (
                                <div className='py-8 text-center text-muted-foreground'>
                                    <Shield className='mx-auto mb-2 h-12 w-12 opacity-50' />
                                    <p className='text-sm'>No roles assigned to this user</p>
                                    <Link href={route('users.edit', user.id)}>
                                        <Button className='mt-2' size='sm' variant='outline'>
                                            Assign Role
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default ShowUser;
