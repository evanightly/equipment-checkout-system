import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Hash, Users } from 'lucide-react';
import { Division } from './columns';

interface DivisionShowProps {
    division: Division & {
        users?: Array<{
            id: number;
            name: string;
            email: string;
        }>;
    };
}

export default function DivisionShow({ division }: DivisionShowProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title={`Division - ${division.name}`} />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={route('divisions.index')}>
                            <Button size='icon' variant='outline'>
                                <ArrowLeft className='h-4 w-4' />
                            </Button>
                        </Link>
                        <div>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-3xl font-bold tracking-tight'>{division.name}</h1>
                                <Badge variant={division.is_active ? 'default' : 'secondary'}>{division.is_active ? 'Active' : 'Inactive'}</Badge>
                            </div>
                            <p className='text-muted-foreground'>Division details and information</p>
                        </div>
                    </div>
                    <Link href={route('divisions.edit', division.id)}>
                        <Button className='flex items-center gap-2'>
                            <Edit className='h-4 w-4' />
                            Edit Division
                        </Button>
                    </Link>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {/* Main Information */}
                    <div className='lg:col-span-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Division Information</CardTitle>
                                <CardDescription>Basic details about this division</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                                            <Hash className='h-4 w-4' />
                                            Division Code
                                        </div>
                                        <p className='text-lg font-semibold'>{division.code}</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                                            <Users className='h-4 w-4' />
                                            Users Count
                                        </div>
                                        <p className='text-lg font-semibold'>{division.users_count || 0}</p>
                                    </div>
                                </div>

                                {division.description && (
                                    <>
                                        <Separator />
                                        <div className='space-y-2'>
                                            <h3 className='text-sm font-medium text-muted-foreground'>Description</h3>
                                            <p className='text-sm leading-relaxed'>{division.description}</p>
                                        </div>
                                    </>
                                )}

                                <Separator />
                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                                            <Calendar className='h-4 w-4' />
                                            Created
                                        </div>
                                        <p className='text-sm'>{formatDate(division.created_at)}</p>
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                                            <Calendar className='h-4 w-4' />
                                            Last Updated
                                        </div>
                                        <p className='text-sm'>{formatDate(division.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Side Information */}
                    <div className='space-y-6'>
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common actions for this division</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-3'>
                                <Link href={route('divisions.edit', division.id)}>
                                    <Button className='w-full justify-start' variant='outline'>
                                        <Edit className='mr-2 h-4 w-4' />
                                        Edit Division
                                    </Button>
                                </Link>
                                <Link href={route('divisions.index')}>
                                    <Button className='w-full justify-start' variant='outline'>
                                        <ArrowLeft className='mr-2 h-4 w-4' />
                                        Back to List
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Users in Division */}
                        {division.users && division.users.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Division Members</CardTitle>
                                    <CardDescription>Users assigned to this division ({division.users.length})</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className='space-y-3'>
                                        {division.users.slice(0, 5).map((user) => (
                                            <div className='flex items-center gap-3 rounded-lg border p-3' key={user.id}>
                                                <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className='flex-1'>
                                                    <p className='text-sm font-medium'>{user.name}</p>
                                                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {division.users.length > 5 && (
                                            <p className='text-center text-sm text-muted-foreground'>And {division.users.length - 5} more users...</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Status Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Information</CardTitle>
                                <CardDescription>Current division status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm font-medium'>Status</span>
                                        <Badge variant={division.is_active ? 'default' : 'secondary'}>
                                            {division.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm font-medium'>Members</span>
                                        <span className='text-sm'>{division.users_count || 0} users</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
