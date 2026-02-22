import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useEffect, type PropsWithChildren } from 'react';
import Swal from 'sweetalert2';
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
    const { flash } = usePage<SharedData>().props;
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    useEffect(() => {
        const commonOptions = {
            timer: 2000,
            toast: true,
            position: 'top-right' as const,
            showConfirmButton: false,
            background: isDark ? '#18181b' : '#fff',
            color: isDark ? '#fafafa' : '#18181b',
            padding: '0 0.5rem', // Minimal padding as flex handles it
            customClass: {
                popup: `rounded-xl border shadow-2xl overflow-hidden ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                    }`,
                htmlContainer: '!m-0 !p-3 flex items-center gap-3',
                icon: 'scale-[.6] !m-0 !mt-[-2px]', // Crisp icon with slight upward offset for balance
            },
            showClass: {
                popup: 'animate-in fade-in slide-in-from-right-2 duration-300'
            },
            hideClass: {
                popup: 'animate-out fade-out slide-out-to-right-2 duration-300'
            }
        };

        if (flash?.success) {
            Swal.fire({
                ...commonOptions,
                icon: 'success',
                html: `<span style="font-size: 13px; font-weight: 500; line-height: 1;">${flash.success}</span>`,
                iconColor: '#10b981',
            });
        }
        if (flash?.error) {
            Swal.fire({
                ...commonOptions,
                icon: 'error',
                html: `<span style="font-size: 13px; font-weight: 500; line-height: 1;">${flash.error}</span>`,
                iconColor: '#ef4444',
            });
        }
    }, [flash, isDark]);

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
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
