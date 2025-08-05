import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Users } from 'lucide-react';

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

interface PermissionShowProps {
    permission: Permission;
}

export default function PermissionShow({ permission }: PermissionShowProps) {
    return (
        <AppLayout>
            <Head title={`Permission: ${permission.name}`} />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={route('permissions.index')}>
                            <Button size='sm' variant='outline'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Permissions
                            </Button>
                        </Link>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight'>Permission Details</h1>
                            <p className='text-muted-foreground'>View permission information and role assignments.</p>
                        </div>
                    </div>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                    {/* Permission Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Shield className='h-5 w-5' />
                                Permission Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Permission Name</label>
                                <code className='mt-1 block rounded bg-muted px-3 py-2 text-sm font-medium'>{permission.name}</code>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Guard</label>
                                <p className='mt-1 text-sm'>{permission.guard_name}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Created At</label>
                                <p className='mt-1 text-sm'>{new Date(permission.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-muted-foreground'>Updated At</label>
                                <p className='mt-1 text-sm'>{new Date(permission.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Roles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Users className='h-5 w-5' />
                                Assigned Roles ({permission.roles.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {permission.roles.length > 0 ? (
                                <div className='space-y-3'>
                                    {permission.roles.map((role) => (
                                        <div className='flex items-center justify-between rounded-lg border p-3' key={role.id}>
                                            <div className='flex items-center gap-3'>
                                                <Badge variant='secondary'>{role.name}</Badge>
                                            </div>
                                            <Link href={route('roles.show', role.id)}>
                                                <Button size='sm' variant='ghost'>
                                                    View Role
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='py-8 text-center'>
                                    <Users className='mx-auto h-12 w-12 text-muted-foreground/50' />
                                    <p className='mt-2 text-sm text-muted-foreground'>No roles have this permission assigned.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
