import AppLayout from '@/layouts/app-layout';
import { formatCurrency, getCsrfHeaders, toCents } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Barcode, FileText, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Boletos', href: '/boletos' },
];

export default function Boletos() {
    const [barcode, setBarcode] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const amountCents = toCents(amount);

        if (!barcode.trim()) {
            setError('Informe o codigo de barras.');
            setSubmitting(false);
            return;
        }

        if (!beneficiary.trim()) {
            setError('Informe o beneficiario.');
            setSubmitting(false);
            return;
        }

        if (amountCents <= 0) {
            setError('Informe um valor valido.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/boletos/pay', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    barcode,
                    beneficiary_name: beneficiary,
                    amount_cents: amountCents,
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message ?? 'Erro ao pagar boleto.');
            }

            setSuccess(payload.message ?? 'Boleto pago.');
            setBarcode('');
            setBeneficiary('');
            setAmount('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Boletos" />
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1b1230]">
                            Pagar boleto
                        </h1>
                        <p className="text-sm text-[#6b5d87]">
                            Digite o codigo de barras e confirme o pagamento.
                        </p>
                    </div>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Codigo de barras
                        <input
                            value={barcode}
                            onChange={(event) => setBarcode(event.target.value)}
                            className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                            placeholder="00000.00000 00000.000000 00000.000000 0 00000000000000"
                        />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Beneficiario
                        <input
                            value={beneficiary}
                            onChange={(event) =>
                                setBeneficiary(event.target.value)
                            }
                            className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                            placeholder="Nome da empresa ou pessoa"
                        />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Valor
                        <input
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                            placeholder="0,00"
                            inputMode="decimal"
                        />
                        <span className="text-xs text-[#7b6a99]">
                            {amount
                                ? formatCurrency(toCents(amount))
                                : 'O pagamento sera concluido instantaneamente.'}
                        </span>
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
                        {submitting ? 'Processando...' : 'Pagar boleto'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Barcode className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2a1f45]">
                                    Leitura inteligente
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Confirme sempre os dados do beneficiario.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold text-[#2a1f45]">
                                    Registro automatico
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Pagamentos ficam salvos no seu historico.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-gradient-to-br from-[#ede9fe] via-white to-white p-6 text-[#2a1f45] shadow-sm">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-sm font-semibold">
                                    Confirmacao segura
                                </p>
                                <p className="text-xs text-[#6b5d87]">
                                    Protecao ativa contra boletos suspeitos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
