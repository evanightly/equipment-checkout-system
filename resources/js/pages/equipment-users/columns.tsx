import { EquipmentUserActions } from '@/components/equipment-user-actions';
import { Badge } from '@/components/ui/badge';
import { EquipmentUser } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<EquipmentUser>[] = [
    {
        accessorKey: 'equipment',
        header: 'Equipment',
        cell: ({ row }) => {
            const borrowing = row.original;

            // Get all equipment items (from details if available, fallback to main equipment)
            const equipmentItems = borrowing.equipment_user_details?.length
                ? borrowing.equipment_user_details.map((detail) => detail.equipment).filter(Boolean)
                : borrowing.equipment
                  ? [borrowing.equipment]
                  : [];

            if (equipmentItems.length === 0) {
                return <div className='text-muted-foreground'>No equipment</div>;
            }

            if (equipmentItems.length === 1) {
                const equipment = equipmentItems[0];
                return (
                    <div>
                        <div className='font-medium'>{equipment?.name}</div>
                        <div className='text-sm text-muted-foreground'>
                            {equipment?.brand} {equipment?.model}
                        </div>
                    </div>
                );
            }

            // Multiple equipment items
            return (
                <div>
                    <div className='font-medium'>{equipmentItems.length} Equipment Items</div>
                    <div className='text-sm text-muted-foreground'>
                        {equipmentItems
                            .slice(0, 2)
                            .map((eq) => eq?.name)
                            .join(', ')}
                        {equipmentItems.length > 2 && ` +${equipmentItems.length - 2} more`}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'user',
        header: 'Borrower',
        cell: ({ row }) => {
            const borrowing = row.original;
            return (
                <div>
                    <div className='font-medium'>{borrowing.user?.name}</div>
                    <div className='text-sm text-muted-foreground'>{borrowing.user?.email}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'purpose',
        header: 'Purpose',
        cell: ({ row }) => {
            const purpose = row.getValue('purpose') as string;
            return purpose ? <span className='text-sm'>{purpose}</span> : <span className='text-muted-foreground'>-</span>;
        },
    },
    {
        accessorKey: 'borrowed_at',
        header: 'Borrowed Date',
        cell: ({ row }) => {
            const date = row.getValue('borrowed_at') as string;
            return <span className='text-sm'>{format(new Date(date), 'MMM dd, yyyy')}</span>;
        },
    },
    {
        accessorKey: 'due_date',
        header: 'Due Date',
        cell: ({ row }) => {
            const date = row.getValue('due_date') as string;
            const isOverdue = new Date(date) < new Date() && row.original.status === 'approved';
            return (
                <span className={`text-sm ${isOverdue ? 'font-medium text-red-600' : ''}`}>
                    {format(new Date(date), 'MMM dd, yyyy')}
                    {isOverdue && <span className='ml-1'>(Overdue)</span>}
                </span>
            );
        },
    },
    {
        accessorKey: 'returned_at',
        header: 'Returned Date',
        cell: ({ row }) => {
            const date = row.getValue('returned_at') as string;
            return date ? (
                <span className='text-sm'>{format(new Date(date), 'MMM dd, yyyy')}</span>
            ) : (
                <span className='text-muted-foreground'>-</span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const borrowing = row.original;
            const isOverdue = borrowing.status === 'approved' && new Date(borrowing.due_date) < new Date() && !borrowing.returned_at;

            const getStatusVariant = (status: string) => {
                if (isOverdue) return 'overdue';
                switch (status) {
                    case 'pending':
                        return 'pending';
                    case 'approved':
                        return 'approved';
                    case 'cancelled':
                        return 'rejected';
                    case 'returned':
                        return 'returned';
                    default:
                        return 'outline';
                }
            };

            const getStatusLabel = (status: string) => {
                if (isOverdue) return 'Overdue';
                switch (status) {
                    case 'pending':
                        return 'Pending';
                    case 'approved':
                        return 'Approved';
                    case 'cancelled':
                        return 'Cancelled';
                    case 'returned':
                        return 'Returned';
                    default:
                        return status;
                }
            };

            return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
        },
    },
    {
        accessorKey: 'approver',
        header: 'Approved By',
        cell: ({ row }) => {
            const approver = row.original.approver;
            return approver ? <span className='text-sm'>{approver.name}</span> : <span className='text-muted-foreground'>-</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const borrowing = row.original;
            const canManage = true; // This will be passed from props

            return <EquipmentUserActions borrowing={borrowing} canManage={canManage} />;
        },
    },
];
