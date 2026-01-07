import AppLayout from '@/layouts/app-layout';
import { formatCurrency, getCsrfHeaders, toCents } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowRightLeft, Shield, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transferências', href: '/transferencias' },
];

export default function Transfers() {
    const [destinationType, setDestinationType] = useState('account');
    const [destination, setDestination] = useState('');
    const [accountDigit, setAccountDigit] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const amountCents = toCents(amount);

        if (!destination.trim()) {
            setError('Informe o destinatario.');
            setSubmitting(false);
            return;
        }

        if (destinationType === 'account' && !accountDigit.trim()) {
            setError('Informe o digito da conta.');
            setSubmitting(false);
            return;
        }

        if (amountCents <= 0) {
            setError('Informe um valor valido.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/transfers', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    destination_type: destinationType,
                    destination,
                    account_digit:
                        destinationType === 'account' ? accountDigit : null,
                    amount_cents: amountCents,
                    description,
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message ?? 'Erro na transferencia.');
            }

            setSuccess(payload.message ?? 'Transferencia realizada.');
            setAmount('');
            setDescription('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transferencias" />
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1b1230]">
                            Transferir entre contas
                        </h1>
                        <p className="text-sm text-[#6b5d87]">
                            Envie valores para pessoas da sua rede.
                        </p>
                    </div>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Como deseja transferir?
                        <select
                            value={destinationType}
                            onChange={(event) =>
                                setDestinationType(event.target.value)
                            }
                            className="h-11 rounded-xl border border-black/10 bg-white/70 px-3 text-sm"
                        >
                            <option value="account">Conta bancaria</option>
                            <option value="email">Email do usuario</option>
                        </select>
                    </label>

                    {destinationType === 'account' ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                                Numero da conta
                                <input
                                    value={destination}
                                    onChange={(event) =>
                                        setDestination(event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                                    placeholder="00000000"
                                />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                                Digito
                                <input
                                    value={accountDigit}
                                    onChange={(event) =>
                                        setAccountDigit(event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                                    placeholder="0"
                                />
                            </label>
                        </div>
                    ) : (
                        <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                            Email do destinatario
                            <input
                                value={destination}
                                onChange={(event) =>
                                    setDestination(event.target.value)
                                }
                                className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                                placeholder="email@exemplo.com"
                            />
                        </label>
                    )}

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Valor
                        <input
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                            placeholder="0,00"
                            inputMode="decimal"
                        />
                        <span className="text-xs text-[#7b6a99]">
                            {amount
                                ? formatCurrency(toCents(amount))
                                : 'Transferências para contas Fintech.laravel sao instantaneas.'}
                        </span>
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Mensagem (opcional)
                        <input
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                            placeholder="Ex: combinados, aluguel, etc"
                        />
                    </label>

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95 disabled:opacity-70"
                    >
                        {submitting ? 'Transferindo...' : 'Confirmar transferencia'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <ArrowRightLeft className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2a1f45]">
                                    Transferencias internas
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Para contas Fintech.laravel, o credito e imediato.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2a1f45]">
                                    Encontre pessoas pelo email
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Use o email cadastrado para identificar o
                                    destinatario.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-gradient-to-br from-[#ede9fe] via-white to-white p-6 text-[#2a1f45] shadow-sm">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Seguranca Fintech.laravel
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Cada transferencia passa por monitoramento
                                    inteligente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
