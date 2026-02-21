import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { BreadcrumbItem } from '@/types';

interface Props {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
}

interface SharedData extends PageProps {
    flash?: { success?: string; error?: string };
}

export default function AdminLayout({ children, title, breadcrumbs = [] }: PropsWithChildren<Props>) {
    const flash = usePage<SharedData>().props.flash;

    // Build breadcrumbs: always start with Admin then the page title
    const crumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/profile' },
        ...(breadcrumbs.length ? breadcrumbs : [{ title, href: '#' }]),
    ];

    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={crumbs} />
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {flash?.success && (
                        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                            ✓ {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                            ✕ {flash.error}
                        </div>
                    )}
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
