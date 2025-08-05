import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface RoleEditProps {
    role: Role;
    permissions: Permission[];
}

export default function RoleEdit({ role, permissions }: RoleEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions.map((p) => p.name),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName),
            );
        }
    };

    // Group permissions by category (before underscore)
    const groupedPermissions = permissions.reduce(
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
            <Head title={`Edit Role: ${role.name}`} />

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
                            <h1 className='text-3xl font-bold tracking-tight'>Edit Role</h1>
                            <p className='text-muted-foreground'>Update role information and permissions.</p>
                        </div>
                    </div>
                </div>

                <form className='space-y-6' onSubmit={submit}>
                    <div className='grid gap-6 md:grid-cols-2'>
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
                                    <Label htmlFor='name'>Role Name</Label>
                                    <Input
                                        className='mt-1'
                                        id='name'
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder='Enter role name'
                                        required
                                        type='text'
                                        value={data.name}
                                    />
                                    {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <Shield className='h-5 w-5' />
                                    Permissions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <div key={category}>
                                        {/* <h4 className='mb-2 text-sm font-medium capitalize'>{category} Permissions</h4> */}
                                        <div className='space-y-2'>
                                            {perms.map((permission) => (
                                                <div className='flex items-center space-x-2' key={permission.id}>
                                                    <Checkbox
                                                        checked={data.permissions.includes(permission.name)}
                                                        id={permission.name}
                                                        onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                                                    />
                                                    <Label className='cursor-pointer text-sm font-normal' htmlFor={permission.name}>
                                                        {permission.name.replace(/_/g, ' ').toLowerCase()}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {errors.permissions && <p className='text-sm text-red-600'>{errors.permissions}</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end'>
                        <Button disabled={processing} type='submit'>
                            <Save className='mr-2 h-4 w-4' />
                            {processing ? 'Updating...' : 'Update Role'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
