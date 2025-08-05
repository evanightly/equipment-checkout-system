import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className='h-8 px-2 lg:px-3'>
                <span>{title}</span>
                <div className='relative ml-2 h-4 w-4'>
                    <ChevronUp
                        className={cn(
                            'absolute -top-1 h-3 w-3 transition-colors',
                            column.getIsSorted() === 'asc' ? 'text-primary' : 'text-muted-foreground',
                        )}
                    />
                    <ChevronDown
                        className={cn(
                            'absolute top-1 h-3 w-3 transition-colors',
                            column.getIsSorted() === 'desc' ? 'text-primary' : 'text-muted-foreground',
                        )}
                    />
                </div>
            </Button>
        </div>
    );
}
