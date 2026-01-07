import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

const DIGIT_COUNT = 8;

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [passwordDigits, setPasswordDigits] = useState<string[]>(
        Array(DIGIT_COUNT).fill(''),
    );
    const passwordRefs = useRef<(HTMLInputElement | null)[]>([]);

    const password = passwordDigits.join('');

    const handleDigitChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const next = [...passwordDigits];
        next[index] = value;
        setPasswordDigits(next);

        if (value && passwordRefs.current[index + 1]) {
            passwordRefs.current[index + 1]?.focus();
        }
    };

    const handleDigitKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (event.key === 'Backspace' && !passwordDigits[index] && index > 0) {
            passwordRefs.current[index - 1]?.focus();
        }
    };

    return (
        <AuthLayout
            title="Entrar na sua conta"
            description="Use seu email e a senha numérica de 8 dígitos."
        >
            <Head title="Entrar" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="h-11 rounded-[8px] border-black/20 bg-white/70"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-[#5b21b6]"
                                            tabIndex={5}
                                        >
                                            Esqueceu a senha?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {passwordDigits.map((digit, index) => (
                                        <input
                                            key={`password-${index}`}
                                            ref={(el) =>
                                                (passwordRefs.current[index] =
                                                    el)
                                            }
                                            value={digit}
                                            onChange={(event) =>
                                                handleDigitChange(
                                                    event.target.value,
                                                    index,
                                                )
                                            }
                                            onKeyDown={(event) =>
                                                handleDigitKeyDown(
                                                    event,
                                                    index,
                                                )
                                            }
                                            inputMode="numeric"
                                            maxLength={1}
                                            aria-label={`Dígito ${
                                                index + 1
                                            } da senha`}
                                            className="h-11 w-full rounded-[8px] border border-black/20 bg-white/70 text-center text-sm"
                                        />
                                    ))}
                                </div>
                                <input
                                    id="password"
                                    type="hidden"
                                    name="password"
                                    value={password}
                                />
                                <InputError message={errors.password} />
                                <p className="text-xs text-[#6b5d87]">
                                    Sua senha tem exatamente 8 dígitos
                                    numéricos.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-[#4b3b70]">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className='w-[25px] h-[25px] cursor-pointer'
                                />
                                <Label htmlFor="remember">Lembrar de mim</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full rounded-[8px] cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90 text-[16px]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Entrar
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-[#4b3b70]">
                                Ainda não tem conta?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="text-[#5b21b6]"
                                >
                                    Criar agora
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
