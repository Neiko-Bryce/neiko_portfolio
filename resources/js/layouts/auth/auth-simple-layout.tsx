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
        <div className="flex min-h-svh items-center justify-center bg-[#fbfbfb] p-4 md:p-8">
            {/* Card Container */}
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl bg-white flex min-h-[560px] border border-zinc-100">

                {/* Left Branding Panel */}
                <div className="hidden md:flex md:w-[42%] relative overflow-hidden flex-col justify-between p-12">
                    {/* Dark background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
                    {/* Dot pattern */}
                    <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }} />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Logo */}
                        <div>
                            <Link href={home()} className="inline-block transition-transform hover:scale-105 active:scale-95 text-white/90 hover:text-white">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                    <AppLogoIcon className="size-6 fill-current" />
                                </div>
                            </Link>
                        </div>

                        {/* Main heading */}
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold tracking-tight text-white leading-[1.15]">
                                Portfolio <br />
                                Dashboard
                            </h1>
                            <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">
                                Sign in to manage your digital presence with ease and precision.
                            </p>

                            <div className="space-y-3.5 pt-2">
                                {[
                                    'Real-time project updates',
                                    'Dynamic skill management',
                                    'Secure administrative access'
                                ].map((text) => (
                                    <div key={text} className="flex items-center gap-3">
                                        <div className="size-5 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
                                            <svg className="w-3 h-3 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-[13px] text-zinc-500 font-medium letter-spacing-[-0.01em]">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copyright */}
                        <p className="text-[11px] font-bold text-zinc-700 tracking-[0.2em] uppercase">
                            © {new Date().getFullYear()} Neiko Bryce
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
                                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h1>
                                    <p className="text-[14px] font-medium text-zinc-400 leading-relaxed">{description}</p>
                                </div>
                            </div>
                            {children}

                            <div className="text-center">
                                <Link
                                    href={home()}
                                    className="inline-flex items-center gap-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-900 transition-all active:scale-95"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
