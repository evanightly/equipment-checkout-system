'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export type User = {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
};

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button className='h-8 px-2 lg:px-3' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} variant='ghost'>
                    Name
                    <ArrowUpDown className='ml-2' />
                </Button>
            );
        },
        cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button className='h-8 px-2 lg:px-3' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} variant='ghost'>
                    Email
                    <ArrowUpDown className='ml-2' />
                </Button>
            );
        },
        cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button className='h-8 px-2 lg:px-3' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} variant='ghost'>
                    Created At
                    <ArrowUpDown className='ml-2' />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return <div className='text-sm text-muted-foreground'>{date.toLocaleDateString()}</div>;
        },
    },
];
