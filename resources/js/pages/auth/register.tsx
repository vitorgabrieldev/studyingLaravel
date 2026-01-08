import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';
import { Bot, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
const STEP_ONE_FIELDS = [
    'name',
    'cpf',
    'birth_date',
    'email',
    'phone',
    'password',
    'password_confirmation',
];

function StepErrorWatcher({
    step,
    errors,
    onStepChange,
}: {
    step: number;
    errors: Record<string, string>;
    onStepChange: (next: number) => void;
}) {
    useEffect(() => {
        if (step !== 2) {
            return;
        }

        const hasStepOneError = STEP_ONE_FIELDS.some(
            (field) => errors?.[field],
        );

        if (hasStepOneError) {
            onStepChange(1);
        }
    }, [step, errors, onStepChange]);

    return null;
}

export default function Register() {
    const [step, setStep] = useState(1);
    const [formValues, setFormValues] = useState({
        name: '',
        cpf: '',
        birth_date: '',
        email: '',
        phone: '',
        address_line: '',
        address_number: '',
        address_complement: '',
        neighborhood: '',
        city: '',
        state: '',
        postal_code: '',
    });
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
    const inputClass = 'h-11 rounded-[8px] border border-black/20 bg-white/70';
    const stepOneComplete =
        formValues.name.trim() &&
        formValues.cpf.trim() &&
        formValues.birth_date.trim() &&
        formValues.email.trim() &&
        formValues.phone.trim() &&
        password.length === DIGIT_COUNT &&
        passwordConfirmation.length === DIGIT_COUNT &&
        password === passwordConfirmation;
    const stepTwoComplete =
        formValues.address_line.trim() &&
        formValues.address_number.trim() &&
        formValues.neighborhood.trim() &&
        formValues.city.trim() &&
        formValues.state.trim() &&
        formValues.postal_code.trim();

    const handleFieldChange =
        (field: keyof typeof formValues) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues((prev) => ({
                ...prev,
                [field]: event.target.value,
            }));
        };

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
                {({ processing, errors, clearErrors }) => (
                    <>
                        <StepErrorWatcher
                            step={step}
                            errors={errors}
                            onStepChange={(next) => {
                                setStep(next);
                            }}
                        />
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                Corrija os campos destacados para continuar.
                            </div>
                        )}
                        <div className="grid gap-6">
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                                                <div className="hidden h-px flex-1 bg-white/70 sm:block" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid">
                                <div
                                    className={`col-start-1 row-start-1 space-y-6 transition-all duration-300 ${
                                        step === 1
                                            ? 'opacity-100 translate-x-0'
                                            : 'pointer-events-none opacity-0 -translate-x-4'
                                    }`}
                                >
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
                                                        value={formValues.name}
                                                        onChange={handleFieldChange(
                                                            'name',
                                                        )}
                                                        className={inputClass}
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
                                                        value={formValues.cpf}
                                                        onChange={handleFieldChange(
                                                            'cpf',
                                                        )}
                                                        className={inputClass}
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
                                                        value={
                                                            formValues.birth_date
                                                        }
                                                        onChange={handleFieldChange(
                                                            'birth_date',
                                                        )}
                                                        className={inputClass}
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
                                                        value={formValues.email}
                                                        onChange={handleFieldChange(
                                                            'email',
                                                        )}
                                                        className={inputClass}
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
                                                        value={formValues.phone}
                                                        onChange={handleFieldChange(
                                                            'phone',
                                                        )}
                                                        className={inputClass}
                                                    />
                                                    <InputError
                                                        message={errors.phone}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-white/70 bg-white/70 backdrop-blur">
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
                                        <div className="grid gap-3">
                                            <div className="grid gap-2">
                                                <Label>Senha (8 dígitos)</Label>
                                                <div
                                                    className="grid grid-cols-4 gap-2 sm:grid-cols-8"
                                                    data-test="password-otp"
                                                >
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
                                                                type="password"
                                                                inputMode="numeric"
                                                                maxLength={1}
                                                                pattern="[0-9]*"
                                                                className="h-11 w-full rounded-[8px] border border-black/20 bg-white/70 text-center text-sm"
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
                                                <div
                                                    className="grid grid-cols-4 gap-2 sm:grid-cols-8"
                                                    data-test="confirm-password-otp"
                                                >
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
                                                                type="password"
                                                                inputMode="numeric"
                                                                maxLength={1}
                                                                pattern="[0-9]*"
                                                                className="h-11 w-full rounded-[8px] border border-black/20 bg-white/70 text-center text-sm"
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
                                        onClick={() => {
                                            clearErrors();
                                            setStep(2);
                                        }}
                                        disabled={!stepOneComplete}
                                        className="w-full rounded-[8px] bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                                    >
                                        Continuar
                                    </Button>
                                </div>
                                <div
                                    className={`col-start-1 row-start-1 space-y-6 transition-all duration-300 ${
                                        step === 2
                                            ? 'opacity-100 translate-x-0'
                                            : 'pointer-events-none opacity-0 translate-x-4'
                                    }`}
                                >
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
                                                        value={
                                                            formValues.address_line
                                                        }
                                                        onChange={handleFieldChange(
                                                            'address_line',
                                                        )}
                                                        className={inputClass}
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
                                                        value={
                                                            formValues.address_number
                                                        }
                                                        onChange={handleFieldChange(
                                                            'address_number',
                                                        )}
                                                        className={inputClass}
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
                                                        value={
                                                            formValues.address_complement
                                                        }
                                                        onChange={handleFieldChange(
                                                            'address_complement',
                                                        )}
                                                        className={inputClass}
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
                                                        value={
                                                            formValues.neighborhood
                                                        }
                                                        onChange={handleFieldChange(
                                                            'neighborhood',
                                                        )}
                                                        className={inputClass}
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
                                                        value={formValues.city}
                                                        onChange={handleFieldChange(
                                                            'city',
                                                        )}
                                                        className={inputClass}
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
                                                        value={
                                                            formValues.state
                                                        }
                                                        onChange={handleFieldChange(
                                                            'state',
                                                        )}
                                                        className={inputClass}
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
                                                    value={
                                                        formValues.postal_code
                                                    }
                                                    onChange={handleFieldChange(
                                                        'postal_code',
                                                    )}
                                                    className={inputClass}
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
                                            onClick={() => {
                                                clearErrors();
                                                setStep(1);
                                            }}
                                            className="rounded-[8px]"
                                        >
                                            Voltar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!stepTwoComplete || processing}
                                            className="flex-1 rounded-[8px] bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                                            data-test="register-user-button"
                                        >
                                            {processing && <Spinner />}
                                            Criar conta
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
