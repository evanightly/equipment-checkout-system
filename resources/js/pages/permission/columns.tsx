'use client';

import { PermissionActions } from '@/components/permission-actions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';

interface Role {
    id: number;
    name: string;
}

export type Permission = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles?: Role[];
};

export const columns: ColumnDef<Permission>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Permission Name' />,
        cell: ({ row }) => <code className='rounded bg-muted px-2 py-1 text-sm font-medium'>{row.getValue('name')}</code>,
    },
    {
        accessorKey: 'roles',
        header: 'Assigned Roles',
        cell: ({ row }) => {
            const roles = row.getValue('roles') as Role[];
            return (
                <div className='flex flex-wrap gap-1'>
                    {roles && roles.length > 0 ? (
                        roles.map((role) => (
                            <Badge className='text-xs' key={role.id} variant='secondary'>
                                {role.name}
                            </Badge>
                        ))
                    ) : (
                        <span className='text-sm text-muted-foreground'>No roles</span>
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
        cell: ({ row }) => {
            const permission = row.original;
            return <PermissionActions permission={permission} />;
        },
    },
];
