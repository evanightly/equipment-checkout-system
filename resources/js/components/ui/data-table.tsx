'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginateResponse } from '@/support/interfaces/others';
import { router } from '@inertiajs/react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    response: PaginateResponse<TData>;
}

export function DataTable<TData, TValue>({ columns, response }: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<{
        pageIndex: number;
        pageSize: number;
    }>({
        pageIndex: window.location.search ? parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10) - 1 : 0, // Inertia uses 1-based index for pages
        pageSize: window.location.search ? parseInt(new URLSearchParams(window.location.search).get('per_page') || '10', 10) : 10,
    });

    const table = useReactTable({
        data: response?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        pageCount: response?.per_page,
        onPaginationChange: setPagination,
        // manualFiltering: true,
        state: {
            pagination,
        },
    });

    useEffect(() => {
        router.prefetch(
            window.location.pathname,
            {
                method: 'get',
                data: {
                    page: pagination.pageIndex + 1, // Inertia uses 1-based index for pages
                    // per_page: pagination.pageSize,
                },
                preserveState: true,
                preserveScroll: true,
            },
            { cacheFor: '1m' },
        );
    }, [pagination]);

    return (
        <>
            <DataTableToolbar table={table} />
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className='text-center text-muted-foreground'>
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <DataTablePagination table={table} response={response} />
        </>
    );
}
