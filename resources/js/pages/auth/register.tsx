import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Criar conta"
            description="Preencha seus dados para abrir sua conta digital."
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
                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d28d9]">
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
                                            <Label htmlFor="cpf">CPF</Label>
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
                                                message={errors.birth_date}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@exemplo.com"
                                                className="h-11 rounded-xl border-white/80 bg-white/70"
                                            />
                                            <InputError message={errors.email} />
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
                                            <InputError message={errors.phone} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d28d9]">
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
                                                message={errors.address_line}
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
                                                message={errors.address_number}
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
                                                message={errors.address_complement}
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
                                                message={errors.neighborhood}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="grid gap-2 sm:col-span-2">
                                            <Label htmlFor="city">Cidade</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                required
                                                name="city"
                                                placeholder="Sua cidade"
                                                className="h-11 rounded-xl border-white/80 bg-white/70"
                                            />
                                            <InputError message={errors.city} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="state">UF</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                required
                                                name="state"
                                                placeholder="SP"
                                                className="h-11 rounded-xl border-white/80 bg-white/70"
                                            />
                                            <InputError message={errors.state} />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="postal_code">CEP</Label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            required
                                            name="postal_code"
                                            placeholder="00000-000"
                                            className="h-11 rounded-xl border-white/80 bg-white/70"
                                        />
                                        <InputError
                                            message={errors.postal_code}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d28d9]">
                                    Segurança
                                </p>
                                <div className="grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Senha</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Crie uma senha forte"
                                            className="h-11 rounded-xl border-white/80 bg-white/70"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirmar senha
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Repita sua senha"
                                            className="h-11 rounded-xl border-white/80 bg-white/70"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full rounded-full bg-primary text-primary-foreground shadow-lg shadow-purple-500/20 hover:bg-primary/90"
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Criar conta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-[#4b3b70]">
                            Ja tem conta?{' '}
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
