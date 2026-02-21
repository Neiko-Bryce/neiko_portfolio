import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Registration Disabled"
            description="Registration is not available for this application"
        >
            <Head title="Register" />
            <div className="text-center">
                <p className="text-sm text-slate-500 mb-4">
                    This is a personal portfolio. Registration is not available.
                </p>
                <a
                    href={login()}
                    className="text-sm text-slate-900 underline underline-offset-4 hover:text-slate-700"
                >
                    Go to login
                </a>
            </div>
        </AuthLayout>
    );
}
