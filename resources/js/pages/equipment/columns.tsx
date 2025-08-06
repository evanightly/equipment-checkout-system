import { EquipmentActions } from '@/components/equipment-actions';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Package } from 'lucide-react';

export const columns: ColumnDef<Equipment>[] = [
    {
        accessorKey: 'image_path',
        header: '',
        cell: ({ row }) => {
            const equipment = row.original;
            return (
                <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800'>
                    {equipment.image_path ? (
                        <img alt={equipment.name} className='h-full w-full object-cover' src={`/storage/${equipment.image_path}`} />
                    ) : (
                        <Package className='h-5 w-5 text-gray-400' />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const equipment = row.original;
            return (
                <div>
                    <div className='font-medium'>{equipment.name}</div>
                    <div className='text-sm text-muted-foreground'>
                        {equipment.brand} {equipment.model}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'serial_number',
        header: 'Serial Number',
        cell: ({ row }) => {
            const serialNumber = row.getValue('serial_number') as string;
            return serialNumber ? <span className='font-mono text-sm'>{serialNumber}</span> : <span className='text-muted-foreground'>-</span>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const getStatusVariant = (status: string) => {
                switch (status) {
                    case 'available':
                        return 'default';
                    case 'borrowed':
                        return 'secondary';
                    case 'maintenance':
                        return 'outline';
                    case 'damaged':
                        return 'destructive';
                    case 'retired':
                        return 'secondary';
                    default:
                        return 'outline';
                }
            };

            const getStatusLabel = (status: string) => {
                switch (status) {
                    case 'available':
                        return 'Available';
                    case 'borrowed':
                        return 'Borrowed';
                    case 'maintenance':
                        return 'Maintenance';
                    case 'damaged':
                        return 'Damaged';
                    case 'retired':
                        return 'Retired';
                    default:
                        return status;
                }
            };

            return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
        },
    },
    {
        accessorKey: 'division',
        header: 'Division',
        cell: ({ row }) => {
            const division = row.original.division;
            return division ? <span className='text-sm'>{division.name}</span> : <span className='text-muted-foreground'>-</span>;
        },
    },
    {
        accessorKey: 'current_borrower',
        header: 'Current Borrower',
        cell: ({ row }) => {
            const borrower = row.original.current_borrower;
            return borrower ? (
                <div className='text-sm'>
                    <div className='font-medium'>{borrower.name}</div>
                    <div className='text-muted-foreground'>{borrower.email}</div>
                </div>
            ) : (
                <span className='text-muted-foreground'>-</span>
            );
        },
    },
    {
        accessorKey: 'purchase_date',
        header: 'Purchase Date',
        cell: ({ row }) => {
            const date = row.getValue('purchase_date') as string;
            return date ? (
                <span className='text-sm'>{format(new Date(date), 'MMM dd, yyyy')}</span>
            ) : (
                <span className='text-muted-foreground'>-</span>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const equipment = row.original;
            return <EquipmentActions equipment={equipment} />;
        },
    },
];
