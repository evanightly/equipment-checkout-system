'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { useToast } from '@/hooks/use-toast';
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

export type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
    users_count: number;
};

const DeleteRoleDialog = ({ role }: { role: Role }) => {
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(route('roles.destroy', role.id), {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Role deleted successfully.',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.message || 'Failed to delete role.',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='text-red-600 hover:text-red-800' size='sm' variant='ghost'>
                    <Trash2 className='h-4 w-4' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the role <strong>{role.name}</strong>? This action cannot be undone.
                        {role.users_count > 0 && (
                            <span className='mt-2 block font-medium text-red-600'>Warning: This role is assigned to {role.users_count} user(s).</span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-600 hover:bg-red-700' onClick={handleDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export const columns: ColumnDef<Role>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Role Name' />,
        cell: ({ row }) => (
            <Badge className='text-sm font-medium' variant='outline'>
                {row.getValue('name')}
            </Badge>
        ),
    },
    {
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
            const permissions = row.getValue('permissions') as Permission[];
            const totalPermissions = permissions?.length || 0;

            return (
                <div className='flex items-center gap-2'>
                    <Badge className='text-xs' variant='secondary'>
                        {totalPermissions} permission{totalPermissions !== 1 ? 's' : ''}
                    </Badge>
                    {totalPermissions > 0 && (
                        <span className='text-xs text-muted-foreground'>
                            (
                            {permissions
                                .slice(0, 2)
                                .map((p) => p.name.split('_')[0])
                                .join(', ')}
                            {totalPermissions > 2 && `, +${totalPermissions - 2} more`})
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Users' />,
        cell: ({ row }) => {
            const usersCount = row.getValue('users_count') as number;
            return (
                <Badge className='text-xs' variant={usersCount > 0 ? 'default' : 'secondary'}>
                    {usersCount} user{usersCount !== 1 ? 's' : ''}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
        cell: ({ row }) => {
            const date = row.getValue('created_at') as string;
            return new Date(date).toLocaleDateString();
        },
    },
    {
        id: 'actions',
        header: () => <div className='text-right'>Actions</div>,
        cell: ({ row }) => {
            const role = row.original;
            return (
                <div className='flex justify-end space-x-2 text-right'>
                    <Link href={route('roles.show', role.id)}>
                        <Button size='sm' variant='ghost'>
                            <Eye className='h-4 w-4' />
                        </Button>
                    </Link>
                    <Link href={route('roles.edit', role.id)}>
                        <Button size='sm' variant='ghost'>
                            <Edit className='h-4 w-4' />
                        </Button>
                    </Link>
                    <DeleteRoleDialog role={role} />
                </div>
            );
        },
    },
];
