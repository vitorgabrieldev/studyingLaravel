import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';
import { Bot, CheckCircle2 } from 'lucide-react';
import { useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

const STEPS = [
    { id: 1, label: 'Dados & segurança' },
    { id: 2, label: 'Endereço' },
];

const DIGIT_COUNT = 8;

export default function Register() {
    const [step, setStep] = useState(1);
    const [passwordDigits, setPasswordDigits] = useState<string[]>(
        Array(DIGIT_COUNT).fill(''),
    );
    const [confirmDigits, setConfirmDigits] = useState<string[]>(
        Array(DIGIT_COUNT).fill(''),
    );

    const passwordRefs = useRef<(HTMLInputElement | null)[]>([]);
    const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

    const password = passwordDigits.join('');
    const passwordConfirmation = confirmDigits.join('');

    const handleDigitChange = (
        value: string,
        index: number,
        digits: string[],
        setDigits: (next: string[]) => void,
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const next = [...digits];
        next[index] = value;
        setDigits(next);

        if (value && refs.current[index + 1]) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleDigitKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        digits: string[],
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) => {
        if (event.key === 'Backspace' && !digits[index] && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    return (
        <AuthLayout
            title="Criar conta"
            description="Abra sua conta digital em dois passos rápidos."
        >
            <Head title="Criar conta" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                                <div className="flex items-center justify-between gap-4">
                                    {STEPS.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-1 items-center gap-3"
                                        >
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                                                    step >= item.id
                                                        ? 'border-[#f21d41] bg-[#fde2d8] text-[#b91c3a]'
                                                        : 'border-black/20 bg-white/70 text-[#6b5d87]'
                                                }`}
                                            >
                                                {item.id}
                                            </div>
                                            <span
                                                className={`text-xs font-semibold ${
                                                    step === item.id
                                                        ? 'text-[#1b1230]'
                                                        : 'text-[#6b5d87]'
                                                }`}
                                            >
                                                {item.label}
                                            </span>
                                            {index < STEPS.length - 1 && (
                                                <div className="hidden h-px flex-1 bg-white/70 md:block" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b91c3a]">
                                            Dados pessoais
                                        </p>
                                        <div className="grid gap-3">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Nome completo
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Seu nome completo"
                                                    className="h-11 rounded-xl border-white/80 bg-white/70"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                    className="mt-1"
                                                />
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="cpf">
                                                        CPF
                                                    </Label>
                                                    <Input
                                                        id="cpf"
                                                        type="text"
                                                        required
                                                        autoComplete="off"
                                                        name="cpf"
                                                        placeholder="000.000.000-00"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={errors.cpf}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="birth_date">
                                                        Data de nascimento
                                                    </Label>
                                                    <Input
                                                        id="birth_date"
                                                        type="date"
                                                        required
                                                        name="birth_date"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.birth_date
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        required
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder="email@exemplo.com"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone">
                                                        Celular
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="text"
                                                        required
                                                        name="phone"
                                                        placeholder="(00) 00000-0000"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#1b1230]">
                                            <Bot className="h-4 w-4 text-[#b91c3a]" />
                                            Segurança com IA
                                        </div>
                                        <p className="text-xs text-[#6b5d87]">
                                            Sua senha deve ter exatamente 8
                                            dígitos numéricos.
                                        </p>
                                        <ul className="grid gap-2 text-xs text-[#6b5d87]">
                                            {[
                                                'Use números que você não compartilha.',
                                                'Evite sequências simples (ex: 12345678).',
                                                'Não reutilize a mesma senha de outros apps.',
                                            ].map((tip) => (
                                                <li
                                                    key={tip}
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="h-3 w-3 text-[#b91c3a]" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="grid gap-3 sm:grid-cols-1">
                                            <div className="grid gap-2">
                                                <Label>Senha (8 dígitos)</Label>
                                                <div className="flex gap-2">
                                                    {passwordDigits.map(
                                                        (digit, index) => (
                                                            <input
                                                                key={`password-${index}`}
                                                                ref={(el) =>
                                                                    (passwordRefs.current[
                                                                        index
                                                                    ] = el)
                                                                }
                                                                value={digit}
                                                                onChange={(event) =>
                                                                    handleDigitChange(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                        index,
                                                                        passwordDigits,
                                                                        setPasswordDigits,
                                                                        passwordRefs,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    event,
                                                                ) =>
                                                                    handleDigitKeyDown(
                                                                        event,
                                                                        index,
                                                                        passwordDigits,
                                                                        passwordRefs,
                                                                    )
                                                                }
                                                                inputMode="numeric"
                                                                maxLength={1}
                                                                className="h-11 w-10 rounded-[8px] border border-black/20 bg-white/70 text-center text-sm"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>
                                                    Confirmar senha
                                                </Label>
                                                <div className="flex gap-2">
                                                    {confirmDigits.map(
                                                        (digit, index) => (
                                                            <input
                                                                key={`confirm-${index}`}
                                                                ref={(el) =>
                                                                    (confirmRefs.current[
                                                                        index
                                                                    ] = el)
                                                                }
                                                                value={digit}
                                                                onChange={(event) =>
                                                                    handleDigitChange(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                        index,
                                                                        confirmDigits,
                                                                        setConfirmDigits,
                                                                        confirmRefs,
                                                                    )
                                                                }
                                                                onKeyDown={(
                                                                    event,
                                                                ) =>
                                                                    handleDigitKeyDown(
                                                                        event,
                                                                        index,
                                                                        confirmDigits,
                                                                        confirmRefs,
                                                                    )
                                                                }
                                                                inputMode="numeric"
                                                                maxLength={1}
                                                                className="h-11 w-10 rounded-[8px] border border-black/20 bg-white/70 text-center text-sm"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="hidden"
                                        name="password"
                                        value={password}
                                    />
                                    <input
                                        type="hidden"
                                        name="password_confirmation"
                                        value={passwordConfirmation}
                                    />

                                    <Button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="w-full rounded-full bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b91c3a]">
                                            Endereço
                                        </p>
                                        <div className="grid gap-3">
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="address_line">
                                                        Rua
                                                    </Label>
                                                    <Input
                                                        id="address_line"
                                                        type="text"
                                                        required
                                                        name="address_line"
                                                        placeholder="Rua ou avenida"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.address_line
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="address_number">
                                                        Número
                                                    </Label>
                                                    <Input
                                                        id="address_number"
                                                        type="text"
                                                        required
                                                        name="address_number"
                                                        placeholder="000"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.address_number
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="address_complement">
                                                        Complemento
                                                    </Label>
                                                    <Input
                                                        id="address_complement"
                                                        type="text"
                                                        name="address_complement"
                                                        placeholder="Apto, bloco, etc"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.address_complement
                                                        }
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="neighborhood">
                                                        Bairro
                                                    </Label>
                                                    <Input
                                                        id="neighborhood"
                                                        type="text"
                                                        required
                                                        name="neighborhood"
                                                        placeholder="Seu bairro"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.neighborhood
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-3 sm:grid-cols-3">
                                                <div className="grid gap-2 sm:col-span-2">
                                                    <Label htmlFor="city">
                                                        Cidade
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        type="text"
                                                        required
                                                        name="city"
                                                        placeholder="Sua cidade"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={errors.city}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="state">
                                                        UF
                                                    </Label>
                                                    <Input
                                                        id="state"
                                                        type="text"
                                                        required
                                                        name="state"
                                                        placeholder="SP"
                                                        className="h-11 rounded-xl border-white/80 bg-white/70"
                                                    />
                                                    <InputError
                                                        message={errors.state}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="postal_code">
                                                    CEP
                                                </Label>
                                                <Input
                                                    id="postal_code"
                                                    type="text"
                                                    required
                                                    name="postal_code"
                                                    placeholder="00000-000"
                                                    className="h-11 rounded-xl border-white/80 bg-white/70"
                                                />
                                                <InputError
                                                    message={
                                                        errors.postal_code
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setStep(1)}
                                        >
                                            Voltar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 rounded-full bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                                            data-test="register-user-button"
                                        >
                                            {processing && <Spinner />}
                                            Criar conta
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center text-sm text-[#4b3b70]">
                            Já tem conta?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-[#5b21b6]"
                            >
                                Entrar
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
