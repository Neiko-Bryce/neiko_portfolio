import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
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
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">
                            Email address
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
                            placeholder="email@example.com"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.email && (
                            <p className="text-sm text-red-600">{form.errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </label>
                            {canResetPassword && (
                                <a
                                    href={request()}
                                    className="ml-auto text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </a>
                            )}
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={e => form.setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.password && (
                            <p className="text-sm text-red-600">{form.errors.password}</p>
                        )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center space-x-3">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={e => form.setData('remember', e.target.checked)}
                            tabIndex={3}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <label htmlFor="remember" className="text-sm font-medium text-slate-700">
                            Remember me
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        tabIndex={4}
                        disabled={form.processing}
                        className="mt-2 w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {form.processing ? (
                            <svg className="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        Log in
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
