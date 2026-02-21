import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-slate-100 p-4 md:p-8">
            {/* Card Container */}
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl bg-white flex min-h-[520px]">

                {/* Left Branding Panel */}
                <div className="hidden md:flex md:w-[42%] relative overflow-hidden flex-col justify-between p-10">
                    {/* Dark background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
                    {/* Dot pattern */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }} />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Logo */}
                        <div>
                            <Link href={home()} className="inline-block">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                    <AppLogoIcon className="size-5 fill-current text-white" />
                                </div>
                            </Link>
                        </div>

                        {/* Main heading */}
                        <div className="space-y-5">
                            <h1 className="text-2xl font-bold leading-snug text-white">
                                Portfolio<br />Management
                            </h1>
                            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[240px]">
                                Sign in to manage your portfolio content, projects, and profile.
                            </p>

                            <div className="space-y-2.5 pt-1">
                                {['Manage projects & experience', 'Update skills & certifications', 'Secure admin access'].map((text) => (
                                    <div key={text} className="flex items-center gap-2.5">
                                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-[12px] text-slate-500">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copyright */}
                        <p className="text-[10px] text-slate-700 tracking-widest uppercase">
                            © {new Date().getFullYear()} Portfolio
                        </p>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 md:px-14 bg-white">
                    <div className="w-full max-w-sm">
                        <div className="flex flex-col gap-8">
                            {/* Mobile logo */}
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium md:hidden"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md">
                                        <AppLogoIcon className="size-9 fill-current text-slate-900" />
                                    </div>
                                </Link>

                                <div className="space-y-2 text-center">
                                    <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
                                    <p className="text-sm text-slate-400">{description}</p>
                                </div>
                            </div>
                            {children}

                            <div className="text-center">
                                <Link
                                    href={home()}
                                    className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to portfolio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
