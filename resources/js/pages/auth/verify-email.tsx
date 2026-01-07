// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verificar email"
            description="Enviamos um link para confirmar seu email."
        >
            <Head title="Verificar email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Um novo link foi enviado para o email cadastrado.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            className="w-full rounded-full bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                        >
                            {processing && <Spinner />}
                            Reenviar email de verificacao
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm text-[#5b21b6]"
                        >
                            Sair
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
