import { DivisionActions } from '@/components/division-actions';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { ColumnDef } from '@tanstack/react-table';

export interface Division {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_active: boolean;
    users_count: number;
    created_at: string;
    updated_at: string;
}

export const columns: ColumnDef<Division>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
        cell: ({ row }) => {
            const division = row.original;
            return <div className='font-medium'>{division.code}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Division Name' />,
        cell: ({ row }) => {
            const division = row.original;
            return (
                <div>
                    <div className='font-medium'>{division.name}</div>
                    {division.description && (
                        <div className='mt-1 text-sm text-muted-foreground'>
                            {division.description.length > 60 ? `${division.description.substring(0, 60)}...` : division.description}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Users' />,
        cell: ({ row }) => {
            const division = row.original;
            return (
                <div className='text-center'>
                    <Badge variant='outline'>
                        {division.users_count} {division.users_count === 1 ? 'user' : 'users'}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
        cell: ({ row }) => {
            const division = row.original;
            return <Badge variant={division.is_active ? 'default' : 'secondary'}>{division.is_active ? 'Active' : 'Inactive'}</Badge>;
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
        cell: ({ row }) => {
            const division = row.original;
            return <div className='text-sm text-muted-foreground'>{new Date(division.created_at).toLocaleDateString()}</div>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const division = row.original;
            return <DivisionActions division={division} />;
        },
    },
];
