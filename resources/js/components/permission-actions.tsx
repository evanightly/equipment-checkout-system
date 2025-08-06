import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
}

interface PermissionActionsProps {
    permission: Permission;
}

export function PermissionActions({ permission }: PermissionActionsProps) {
    const { confirmDelete } = useConfirmation();

    const handleDelete = async () => {
        const result = await confirmDelete(permission.name);
        if (result.confirmed) {
            router.delete(route('permissions.destroy', permission.id));
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
                    <Link href={route('permissions.show', permission.id)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View
                    </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                    <Link href={route('permissions.edit', permission.id)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={handleDelete}>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
