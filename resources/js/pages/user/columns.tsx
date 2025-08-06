'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { UserActions } from '@/components/user-actions';
import { ColumnDef } from '@tanstack/react-table';

interface Role {
    id: number;
    name: string;
}

interface Division {
    id: number;
    name: string;
    code: string;
}

export type User = {
    id: number;
    name: string;
    email: string;
    nip?: string;
    division_id?: number;
    division?: Division;
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
        accessorKey: 'division',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Division' />,
        cell: ({ row }) => {
            const user = row.original;
            return user.division ? (
                <div className='flex flex-col'>
                    <span className='font-medium'>{user.division.name}</span>
                    <span className='text-sm text-muted-foreground'>{user.division.code}</span>
                </div>
            ) : (
                <span className='text-muted-foreground'>No division</span>
            );
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
        cell: ({ row }) => {
            const user = row.original;
            return <UserActions user={user} />;
        },
    },
];
