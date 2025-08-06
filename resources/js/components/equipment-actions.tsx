import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Equipment } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

interface EquipmentActionsProps {
    equipment: Equipment;
}

export function EquipmentActions({ equipment }: EquipmentActionsProps) {
    const { confirmDelete } = useConfirmation();

    const handleDelete = async () => {
        const result = await confirmDelete(equipment.name);
        if (result.confirmed) {
            router.delete(route('equipment.destroy', equipment.id));
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
                    <Link href={route('equipment.show', equipment.id)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('equipment.edit', equipment.id)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={handleDelete}>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
