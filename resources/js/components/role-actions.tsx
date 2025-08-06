import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useConfirmation } from '@/hooks/use-confirmation';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Trash2 } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    users_count?: number;
}

interface RoleActionsProps {
    role: Role;
}

export function RoleActions({ role }: RoleActionsProps) {
    const { confirm } = useConfirmation();

    const handleDelete = async () => {
        const description =
            role.users_count && role.users_count > 0
                ? `Are you sure you want to delete "${role.name}"? This role is assigned to ${role.users_count} user(s). This action cannot be undone.`
                : `Are you sure you want to delete "${role.name}"? This action cannot be undone.`;

        const result = await confirm({
            title: 'Delete Role',
            description,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'destructive',
        });

        if (result.confirmed) {
            router.delete(route('roles.destroy', role.id));
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
                    <Link href={route('roles.show', role.id)}>
                        <Eye className='mr-2 h-4 w-4' />
                        View
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={route('roles.edit', role.id)}>
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
