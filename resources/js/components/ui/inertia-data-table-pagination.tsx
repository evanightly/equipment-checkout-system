import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface InertiaDataTablePaginationProps {
    pagination: PaginationData;
    className?: string;
}

export function InertiaDataTablePagination({ pagination, className }: InertiaDataTablePaginationProps) {
    const { current_page, last_page, per_page, total, from, to } = pagination;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= last_page && page !== current_page) {
            router.get(
                window.location.pathname,
                {
                    ...Object.fromEntries(new URLSearchParams(window.location.search)),
                    page,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handlePerPageChange = (newPerPage: string) => {
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(new URLSearchParams(window.location.search)),
                per_page: newPerPage,
                page: 1, // Reset to first page when changing per page
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className={`flex items-center justify-between px-2 ${className}`}>
            <div className='flex-1 text-sm text-muted-foreground'>
                Showing {from} to {to} of {total} entries
            </div>
            <div className='flex items-center space-x-6 lg:space-x-8'>
                <div className='flex items-center space-x-2'>
                    <p className='text-sm font-medium'>Rows per page</p>
                    <Select value={per_page.toString()} onValueChange={handlePerPageChange}>
                        <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={per_page.toString()} />
                        </SelectTrigger>
                        <SelectContent side='top'>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                    Page {current_page} of {last_page}
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => handlePageChange(1)}
                        disabled={current_page === 1}
                    >
                        <span className='sr-only'>Go to first page</span>
                        <ChevronsLeft className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => handlePageChange(current_page - 1)}
                        disabled={current_page === 1}
                    >
                        <span className='sr-only'>Go to previous page</span>
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => handlePageChange(current_page + 1)}
                        disabled={current_page === last_page}
                    >
                        <span className='sr-only'>Go to next page</span>
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                    <Button
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => handlePageChange(last_page)}
                        disabled={current_page === last_page}
                    >
                        <span className='sr-only'>Go to last page</span>
                        <ChevronsRight className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </div>
    );
}
