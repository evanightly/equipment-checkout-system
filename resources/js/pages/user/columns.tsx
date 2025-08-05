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

interface Role {
    id: number;
    name: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    nip?: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
};

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

const DeleteUserDialog = ({ user }: { user: User }) => {
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(route('users.destroy', user.id), {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'User deleted successfully.',
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: errors.message || 'Failed to delete user.',
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
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
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

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
        cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'nip',
        header: 'NIP',
        cell: ({ row }) => {
            const nip = row.getValue('nip') as string;
            return nip ? <code className='rounded bg-muted px-2 py-1 text-sm'>{nip}</code> : <span className='text-muted-foreground'>—</span>;
        },
    },
    {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => {
            const roles = row.getValue('roles') as Role[];
            return (
                <div className='flex flex-wrap gap-1'>
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <Badge className='text-xs' key={role.id} variant={getRoleBadgeVariant(role.name)}>
                                {role.name}
                            </Badge>
                        ))
                    ) : (
                        <Badge className='text-xs' variant='outline'>
                            No role
                        </Badge>
                    )}
                </div>
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
        header: () => <div className='text-right pr-2'>Actions</div>,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className='flex justify-end space-x-2 text-right'>
                    <Link href={route('users.show', user.id)}>
                        <Button size='sm' variant='ghost'>
                            <Eye className='h-4 w-4' />
                        </Button>
                    </Link>
                    <Link href={route('users.edit', user.id)}>
                        <Button size='sm' variant='ghost'>
                            <Edit className='h-4 w-4' />
                        </Button>
                    </Link>
                    <DeleteUserDialog user={user} />
                </div>
            );
        },
    },
];
