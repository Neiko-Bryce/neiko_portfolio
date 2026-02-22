import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { home } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Feature Disabled"
            description="Account registration is currently disabled."
        >
            <Head title="Register" />
            <div className="text-center">
                <a href={home()} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4">
                    Back to home
                </a>
            </div>
        </AuthLayout>
    );
}
