'use client';

import { RoleActions } from '@/components/role-actions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';

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
        cell: ({ row }) => {
            const role = row.original;
            return <RoleActions role={role} />;
        },
    },
];
