import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Dados pessoais"
                        description="Mantenha seus dados sempre atualizados."
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nome completo"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email principal"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="cpf">CPF</Label>
                                        <Input
                                            id="cpf"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.cpf ?? ''}
                                            name="cpf"
                                            required
                                            autoComplete="off"
                                            placeholder="000.000.000-00"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.cpf}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Celular</Label>
                                        <Input
                                            id="phone"
                                            className="mt-1 block w-full"
                                            defaultValue={auth.user.phone ?? ''}
                                            name="phone"
                                            required
                                            autoComplete="tel"
                                            placeholder="(00) 00000-0000"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.phone}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="birth_date">
                                        Data de nascimento
                                    </Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            auth.user.birth_date ?? ''
                                        }
                                        name="birth_date"
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.birth_date}
                                    />
                                </div>

                                <HeadingSmall
                                    title="Endereco"
                                    description="Atualize seu endereco residencial."
                                />

                                <div className="grid gap-2 sm:grid-cols-3">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="address_line">
                                            Rua
                                        </Label>
                                        <Input
                                            id="address_line"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.address_line ?? ''
                                            }
                                            name="address_line"
                                            required
                                            placeholder="Rua ou avenida"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.address_line}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address_number">
                                            Numero
                                        </Label>
                                        <Input
                                            id="address_number"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.address_number ?? ''
                                            }
                                            name="address_number"
                                            required
                                            placeholder="000"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.address_number}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="address_complement">
                                            Complemento
                                        </Label>
                                        <Input
                                            id="address_complement"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.address_complement ??
                                                ''
                                            }
                                            name="address_complement"
                                            placeholder="Apto, bloco, etc"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.address_complement}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="neighborhood">
                                            Bairro
                                        </Label>
                                        <Input
                                            id="neighborhood"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.neighborhood ?? ''
                                            }
                                            name="neighborhood"
                                            required
                                            placeholder="Bairro"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.neighborhood}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-3">
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="city">Cidade</Label>
                                        <Input
                                            id="city"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.city ?? ''
                                            }
                                            name="city"
                                            required
                                            placeholder="Cidade"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.city}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="state">UF</Label>
                                        <Input
                                            id="state"
                                            className="mt-1 block w-full"
                                            defaultValue={
                                                auth.user.state ?? ''
                                            }
                                            name="state"
                                            required
                                            placeholder="SP"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.state}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="postal_code">CEP</Label>
                                    <Input
                                        id="postal_code"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            auth.user.postal_code ?? ''
                                        }
                                        name="postal_code"
                                        required
                                        placeholder="00000-000"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.postal_code}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Seu email ainda nao foi
                                                verificado.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Clique aqui para reenviar o
                                                    email de verificacao.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    Um novo link de verificacao
                                                    foi enviado para seu email.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Salvar
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Salvo
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
