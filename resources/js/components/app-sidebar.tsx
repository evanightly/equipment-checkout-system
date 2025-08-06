import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, Folder, History, LayoutGrid, Package, Shield, User, Users } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

interface User {
    id: number;
    name: string;
    nip: string;
    email: string;
    roles: Array<{
        id: number;
        name: string;
        guard_name: string;
    }>;
}

const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['SuperAdmin', 'Admin', 'Viewer'], // All roles can access dashboard
    },
    {
        title: 'Equipment',
        href: '/equipment',
        icon: Package,
        roles: ['SuperAdmin', 'Admin', 'Viewer'], // All roles can view equipment
    },
    {
        title: 'Borrowing',
        href: '/equipment-users',
        icon: History,
        roles: ['SuperAdmin', 'Admin', 'Viewer'], // All roles can view equipment users
    },
    {
        title: 'Divisions',
        href: '/divisions',
        icon: Building2,
        roles: ['SuperAdmin'], // Only SuperAdmin can manage divisions
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
        roles: ['SuperAdmin', 'Admin'], // Only SuperAdmin and Admin can manage users
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: User,
        roles: ['SuperAdmin'], // Only SuperAdmin can manage roles
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Shield,
        roles: ['SuperAdmin'], // Only SuperAdmin can view permissions
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/evanightly/equipment-checkout-system',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const auth = props.auth as { user: User };

    // Get user roles
    const userRoles = useMemo(() => {
        return auth.user?.roles?.map((role: { name: string }) => role.name);
    }, [auth.user.roles]);

    // Filter navigation items based on user roles
    const visibleNavItems = useMemo(() => {
        return allNavItems.filter((item) => {
            // If no roles specified, show to everyone
            if (!item.roles || item.roles.length === 0) {
                return true;
            }
            // Check if user has any of the required roles
            return item.roles.some((role) => userRoles?.includes(role));
        });
    }, [userRoles]);

    return (
        <Sidebar collapsible='icon' variant='inset'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <Link href='/dashboard' prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className='mt-auto' />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
