import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Division } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';

interface Role {
    value: string;
    label: string;
    permissions: string[];
}

interface Props {
    roles: Role[];
    divisions: Division[];
}

const CreateUser: React.FC<Props> = ({ roles, divisions }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nip: '',
        password: '',
        password_confirmation: '',
        role: '',
        division_id: '',
    });

    const selectedRole = roles.find((role) => role.value === data.role);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title='Create User' />

            <div className='space-y-6 p-4'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Link href={route('users.index')}>
                            <Button size='sm' variant='ghost'>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to Users
                            </Button>
                        </Link>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight'>Create User</h1>
                            <p className='text-muted-foreground'>Add a new user to the system</p>
                        </div>
                    </div>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className='space-y-6' onSubmit={submit}>
                                {/* Name */}
                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Name *</Label>
                                    <Input
                                        className={errors.name ? 'border-red-500' : ''}
                                        id='name'
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder='Enter full name'
                                        type='text'
                                        value={data.name}
                                    />
                                    {errors.name && <p className='text-sm text-red-600'>{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email *</Label>
                                    <Input
                                        className={errors.email ? 'border-red-500' : ''}
                                        id='email'
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder='Enter email address'
                                        type='email'
                                        value={data.email}
                                    />
                                    {errors.email && <p className='text-sm text-red-600'>{errors.email}</p>}
                                </div>

                                {/* NIP */}
                                <div className='space-y-2'>
                                    <Label htmlFor='nip'>NIP (18 digits)</Label>
                                    <Input
                                        className={errors.nip ? 'border-red-500' : ''}
                                        id='nip'
                                        maxLength={18}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        placeholder='Enter 18-digit NIP'
                                        type='text'
                                        value={data.nip}
                                    />
                                    {errors.nip && <p className='text-sm text-red-600'>{errors.nip}</p>}
                                    <p className='text-sm text-muted-foreground'>Optional. Must be exactly 18 digits if provided.</p>
                                </div>

                                {/* Password */}
                                <div className='space-y-2'>
                                    <Label htmlFor='password'>Password *</Label>
                                    <Input
                                        className={errors.password ? 'border-red-500' : ''}
                                        id='password'
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder='Enter password'
                                        type='password'
                                        value={data.password}
                                    />
                                    {errors.password && <p className='text-sm text-red-600'>{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div className='space-y-2'>
                                    <Label htmlFor='password_confirmation'>Confirm Password *</Label>
                                    <Input
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        id='password_confirmation'
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder='Confirm password'
                                        type='password'
                                        value={data.password_confirmation}
                                    />
                                    {errors.password_confirmation && <p className='text-sm text-red-600'>{errors.password_confirmation}</p>}
                                </div>

                                {/* Role */}
                                <div className='space-y-2'>
                                    <Label htmlFor='role'>Role</Label>
                                    <Select
                                        onValueChange={(value) => setData('role', value === 'no-role' ? '' : value)}
                                        value={data.role || 'no-role'}
                                    >
                                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='no-role'>No role</SelectItem>
                                            {roles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className='text-sm text-red-600'>{errors.role}</p>}
                                </div>

                                {/* Division */}
                                <div className='space-y-2'>
                                    <Label htmlFor='division_id'>Division</Label>
                                    <Select
                                        onValueChange={(value) => setData('division_id', value === 'no-division' ? '' : value)}
                                        value={data.division_id || 'no-division'}
                                    >
                                        <SelectTrigger className={errors.division_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder='Select a division' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='no-division'>No division</SelectItem>
                                            {divisions.map((division) => (
                                                <SelectItem key={division.id} value={division.id.toString()}>
                                                    {division.name} ({division.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.division_id && <p className='text-sm text-red-600'>{errors.division_id}</p>}
                                </div>

                                {/* Role Permissions Preview */}
                                {selectedRole && (
                                    <div className='rounded-lg border bg-muted/50 p-4'>
                                        <h4 className='mb-3 font-medium'>Role Permissions</h4>
                                        <div className='flex flex-wrap gap-2'>
                                            {selectedRole.permissions.map((permission) => (
                                                <Badge className='text-xs' key={permission} variant='secondary'>
                                                    {permission.replace('_', ' ').toLowerCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className='flex gap-4 pt-4'>
                                    <Button disabled={processing} type='submit'>
                                        <Save className='mr-2 h-4 w-4' />
                                        {processing ? 'Creating...' : 'Create User'}
                                    </Button>
                                    <Link href={route('users.index')}>
                                        <Button type='button' variant='outline'>
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateUser;
