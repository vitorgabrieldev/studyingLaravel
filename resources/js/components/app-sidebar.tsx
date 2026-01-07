import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ArrowRightLeft,
    Bell,
    FileText,
    Home,
    KeyRound,
    CreditCard,
    LineChart,
    ReceiptText,
    Send,
    Settings,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Início',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Pix',
        href: '/pix',
        icon: Send,
    },
    {
        title: 'Cartões',
        href: '/cartoes',
        icon: CreditCard,
    },
    {
        title: 'Notificações',
        href: '/notificacoes',
        icon: Bell,
    },
    {
        title: 'Painel',
        href: '/painel',
        icon: LineChart,
    },
    {
        title: 'Transferências',
        href: '/transferencias',
        icon: ArrowRightLeft,
    },
    {
        title: 'Extrato',
        href: '/transacoes',
        icon: ReceiptText,
    },
    {
        title: 'Boletos',
        href: '/boletos',
        icon: FileText,
    },
    {
        title: 'Chaves Pix',
        href: '/pix/keys',
        icon: KeyRound,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Configurações',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
