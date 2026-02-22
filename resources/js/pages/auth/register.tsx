import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { login, register } from '@/routes';

export default function Register() {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(register(), {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your admin account"
        >
            <Head title="Register" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* Name */}
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                            required
                            autoFocus
                            placeholder="John Doe"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.name && (
                            <p className="text-sm text-red-600">{form.errors.name}</p>
                        )}
                    </div>

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
                            placeholder="email@example.com"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.email && (
                            <p className="text-sm text-red-600">{form.errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <label htmlFor="password" university-role="label" className="text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={e => form.setData('password', e.target.value)}
                            required
                            placeholder="Password"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.password && (
                            <p className="text-sm text-red-600">{form.errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <label htmlFor="password_confirmation" className="text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={e => form.setData('password_confirmation', e.target.value)}
                            required
                            placeholder="Confirm Password"
                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                        />
                        {form.errors.password_confirmation && (
                            <p className="text-sm text-red-600">{form.errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="mt-2 w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {form.processing ? (
                            <svg className="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : null}
                        Register
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <a
                        href={login()}
                        className="text-slate-900 font-medium underline underline-offset-4 hover:text-slate-700 transition-colors"
                    >
                        Log in
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
}
