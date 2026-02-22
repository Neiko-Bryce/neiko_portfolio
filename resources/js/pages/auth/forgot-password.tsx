import { Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { home } from '@/routes';

export default function ForgotPassword() {
    return (
        <AuthLayout
            title="Feature Disabled"
            description="Password reset is currently disabled."
        >
            <Head title="Forgot password" />
            <div className="text-center">
                <a href={home()} className="text-sm font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-4">
                    Back to home
                </a>
            </div>
        </AuthLayout>
    );
}
