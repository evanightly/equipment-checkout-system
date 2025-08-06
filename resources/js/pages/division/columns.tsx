import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className='h-8 w-8 p-0' variant='ghost'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href={route('divisions.show', division.id)}>
                                <Eye className='mr-2 h-4 w-4' />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={route('divisions.edit', division.id)}>
                                <Pencil className='mr-2 h-4 w-4' />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this division?')) {
                                    // Handle delete logic
                                    console.log('Delete division:', division.id);
                                }
                            }}
                        >
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
