import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Monitor, Moon, Settings, Sun } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { appearance, updateAppearance } = useAppearance();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const getThemeIcon = () => {
        switch (appearance) {
            case 'light':
                return <Sun className='mr-2 h-4 w-4' />;
            case 'dark':
                return <Moon className='mr-2 h-4 w-4' />;
            default:
                return <Monitor className='mr-2 h-4 w-4' />;
        }
    };

    const getThemeLabel = () => {
        switch (appearance) {
            case 'light':
                return 'Light Mode';
            case 'dark':
                return 'Dark Mode';
            default:
                return 'System';
        }
    };

    const toggleTheme = () => {
        const nextTheme = appearance === 'light' ? 'dark' : appearance === 'dark' ? 'system' : 'light';
        updateAppearance(nextTheme);
    };

    return (
        <>
            <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className='block w-full' href={route('profile.edit')} as='button' prefetch onClick={cleanup}>
                        <Settings className='mr-2' />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                    {getThemeIcon()}
                    {getThemeLabel()}
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className='block w-full' method='post' href={route('logout')} as='button' onClick={handleLogout}>
                    <LogOut className='mr-2' />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
