import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({
    status,
}: Props) {
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(store(), {
            onFinish: () => form.reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* Email */}
                    <div className="grid gap-2">
                        <label htmlFor="email" className="text-[13px] font-semibold text-zinc-700 ml-0.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={e => form.setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="your@email.com"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all shadow-sm"
                        />
                        {form.errors.email && (
                            <p className="text-[12px] font-medium text-red-500 ml-0.5 mt-0.5">{form.errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between ml-0.5">
                            <label htmlFor="password" className="text-[13px] font-semibold text-zinc-700">
                                Password
                            </label>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={e => form.setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent transition-all shadow-sm"
                        />
                        {form.errors.password && (
                            <p className="text-[12px] font-medium text-red-500 ml-0.5 mt-0.5">{form.errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        tabIndex={4}
                        disabled={form.processing}
                        className="mt-2 w-full h-11 rounded-xl bg-zinc-900 text-white text-[14px] font-bold hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-lg shadow-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {form.processing ? (
                            <svg className="w-4 h-4 animate-spin text-white/50" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        Sign In
                    </button>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
