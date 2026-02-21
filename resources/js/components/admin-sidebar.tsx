import { Link } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Globe,
    Image,
    LayoutGrid,
    Link2,
    Star,
    User,
    Users,
    Wrench,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

const adminNavItems = [
    { title: 'Profile', href: '/admin/profile', icon: User },
    { title: 'Skills', href: '/admin/skills', icon: Wrench },
    { title: 'Projects', href: '/admin/projects', icon: LayoutGrid },
    { title: 'Experience', href: '/admin/experience', icon: Briefcase },
    { title: 'Certifications', href: '/admin/certifications', icon: Award },
    { title: 'Recommendations', href: '/admin/recommendations', icon: Star },
    { title: 'Gallery', href: '/admin/gallery', icon: Image },
    { title: 'Memberships', href: '/admin/memberships', icon: Users },
    { title: 'Social Links', href: '/admin/social-links', icon: Link2 },
];

export function AdminSidebar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/profile">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Globe className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Admin Panel</span>
                                    <span className="text-xs text-muted-foreground">Portfolio Manager</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Portfolio Sections</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="px-2 mt-auto">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={{ children: 'View Portfolio' }}>
                                <Link href="/" target="_blank">
                                    <Globe />
                                    <span>View Portfolio</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
