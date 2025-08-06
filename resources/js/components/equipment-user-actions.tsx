import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/hooks/use-confirmation';
import { EquipmentUser } from '@/types';
import { Link, router } from '@inertiajs/react';
import { CheckCircle, Eye, MoreHorizontal, RotateCcw, XCircle } from 'lucide-react';

interface EquipmentUserActionsProps {
    borrowing: EquipmentUser;
    canManage?: boolean;
}

export function EquipmentUserActions({ borrowing, canManage = true }: EquipmentUserActionsProps) {
    const { confirmApprove, confirmReject, confirmReturn } = useConfirmation();

    const handleApprove = async () => {
        const equipmentName = borrowing.equipment?.name || 'this request';
        const result = await confirmApprove(equipmentName);
        if (result.confirmed) {
            router.patch(route('equipment-users.approve', borrowing.id));
        }
    };

    const handleReject = async () => {
        const equipmentName = borrowing.equipment?.name || 'this request';
        const result = await confirmReject(equipmentName);
        if (result.confirmed) {
            router.patch(route('equipment-users.reject', borrowing.id));
        }
    };

    const handleReturn = async () => {
        const equipmentName = borrowing.equipment?.name || 'this equipment';
        const result = await confirmReturn(equipmentName);
        if (result.confirmed) {
            router.patch(route('equipment-users.return', borrowing.id));
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='h-8 w-8 p-0' variant='ghost'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                    <Link href={route('equipment-users.show', borrowing.id)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                    </Link>
                </DropdownMenuItem>

                {canManage && borrowing.status === 'pending' && (
                    <>
                        <DropdownMenuItem onClick={handleApprove}>
                            <CheckCircle className='mr-2 h-4 w-4' />
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={handleReject}>
                            <XCircle className='mr-2 h-4 w-4' />
                            Reject
                        </DropdownMenuItem>
                    </>
                )}

                {canManage && borrowing.status === 'approved' && !borrowing.returned_at && (
                    <DropdownMenuItem onClick={handleReturn}>
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Mark as Returned
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
