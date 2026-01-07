import AppLayout from '@/layouts/app-layout';
import { formatCurrency, getCsrfHeaders, toCents } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pix', href: '/pix' },
];

type PixKey = {
    id: number;
    type: string;
    key: string;
};

export default function PixSend() {
    const [keys, setKeys] = useState<PixKey[]>([]);
    const [key, setKey] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loadingKeys, setLoadingKeys] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/pix/keys', {
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((response) => response.json())
            .then((payload) => setKeys(payload.keys ?? []))
            .catch(() => setKeys([]))
            .finally(() => setLoadingKeys(false));
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const amountCents = toCents(amount);

        if (!key.trim()) {
            setError('Informe uma chave Pix valida.');
            setSubmitting(false);
            return;
        }

        if (amountCents <= 0) {
            setError('Informe um valor valido.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/pix/send', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    key,
                    amount_cents: amountCents,
                    description,
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message ?? 'Nao foi possivel enviar.');
            }

            setSuccess(payload.message ?? 'Pix enviado.');
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
            <Head title="Pix" />
            <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1b1230]">
                            Enviar Pix
                        </h1>
                        <p className="text-sm text-[#6b5d87]">
                            Transferências instantaneas para qualquer chave.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                            Chave Pix do destinatario
                            <input
                                value={key}
                                onChange={(event) =>
                                    setKey(event.target.value)
                                }
                                className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                                placeholder="Email, CPF, telefone ou chave aleatoria"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                            Valor
                            <input
                                value={amount}
                                onChange={(event) =>
                                    setAmount(event.target.value)
                                }
                                className="h-11 rounded-xl border border-black/10 bg-white/70 px-3"
                                placeholder="0,00"
                                inputMode="decimal"
                            />
                            <span className="text-xs text-[#7b6a99]">
                                {amount
                                    ? formatCurrency(toCents(amount))
                                    : 'Saldo sera atualizado instantaneamente.'}
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
                                placeholder="Ex: almoço, aluguel, etc..."
                            />
                        </label>
                    </div>

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
                        {submitting ? 'Enviando...' : 'Confirmar Pix'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[#2a1f45]">
                                Minhas chaves
                            </h2>
                            <span className="text-xs text-[#6b5d87]">
                                {loadingKeys
                                    ? 'Carregando'
                                    : `${keys.length} chave(s)`}
                            </span>
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-[#3b2a5b]">
                            {loadingKeys && (
                                <p className="text-xs text-[#7b6a99]">
                                    Consultando suas chaves...
                                </p>
                            )}
                            {!loadingKeys && keys.length === 0 && (
                                <p className="text-xs text-[#7b6a99]">
                                    Nenhuma chave cadastrada ainda.
                                </p>
                            )}
                            {keys.map((pixKey) => (
                                <button
                                    type="button"
                                    key={pixKey.id}
                                    onClick={() => setKey(pixKey.key)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md active:scale-95"
                                >
                                    <span className="text-xs uppercase tracking-[0.2em] text-[#7b6a99]">
                                        {pixKey.type}
                                    </span>
                                    <span className="ml-2 truncate text-sm font-medium text-[#2a1f45]">
                                        {pixKey.key}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-[#ede9fe] via-white to-white p-6 text-[#2a1f45] shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-[#5b21b6]" />
                            <p className="text-sm font-semibold">
                                Seguranca em camadas
                            </p>
                        </div>
                        <p className="mt-2 text-xs text-[#6b5d87]">
                            Todas as transferências Pix sao autenticadas e
                            monitoradas em tempo real.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-[#5b21b6]">
                            <CheckCircle2 className="h-4 w-4" />
                            Protecao antifraude ativa
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
