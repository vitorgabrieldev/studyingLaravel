import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CreditCard,
    Eye,
    EyeOff,
    FileText,
    PlusCircle,
    Send,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

type Transaction = {
    id: number;
    type: string;
    direction: 'debit' | 'credit';
    amount_cents: number;
    description: string;
    created_at: string;
};

type DashboardData = {
    account: {
        branch_number: string;
        account_number: string;
        account_digit: string;
        balance_cents: number;
    };
    transactions: Transaction[];
};

export default function Dashboard({
    dashboard,
}: {
    dashboard: DashboardData;
}) {
    const data = dashboard;
    const loading = false;
    const error = null;
    const [hideValues, setHideValues] = useState(false);

    const accountLabel = data
        ? `${data.account.branch_number} / ${data.account.account_number}-${data.account.account_digit}`
        : '--';
    const maskedAccountLabel = hideValues ? '*** / ****-**' : accountLabel;
    const maskedBalance = hideValues
        ? 'R$ ••••'
        : formatCurrency(data?.account.balance_cents ?? 0);
    const maskedLimit = hideValues ? 'R$ ••••' : formatCurrency(120000);
    const maskedMinimum = hideValues ? 'R$ ••••' : formatCurrency(4200);
    const maskedCardSuffix = hideValues ? '*** ****' : '*** 2451';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="flex flex-1 flex-col gap-6 overflow-x-auto p-6 md:p-8">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f21d41] via-[#f45b4d] to-[#f7b08e] p-8 text-white shadow-xl">
                    <div className="absolute -right-16 -top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 flex items-start justify-between gap-4">
                        <div className="space-y-4">
                            <p className="text-xs uppercase tracking-[0.4em] text-white/80">
                                saldo atual
                            </p>
                            <div className="text-3xl font-semibold md:text-4xl">
                                {loading ? 'Carregando...' : maskedBalance}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
                                <span>Ag/Conta</span>
                                <span className="rounded-full border border-white/30 px-3 py-1 text-xs">
                                    {maskedAccountLabel}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setHideValues((prev) => !prev)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 transition hover:-translate-y-0.5 hover:bg-white/20 active:scale-95"
                            aria-label={
                                hideValues
                                    ? 'Mostrar valores'
                                    : 'Ocultar valores'
                            }
                        >
                            {hideValues ? (
                                <Eye className="h-4 w-4" />
                            ) : (
                                <EyeOff className="h-4 w-4" />
                            )}
                            {hideValues ? 'Mostrar' : 'Ocultar'}
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-4">
                    {[
                        {
                            title: 'Enviar Pix',
                            href: '/pix',
                            icon: Send,
                        },
                        {
                            title: 'Transferir',
                            href: '/transferencias',
                            icon: ArrowUpRight,
                        },
                        {
                            title: 'Pagar boleto',
                            href: '/boletos',
                            icon: FileText,
                        },
                        {
                            title: 'Chaves Pix',
                            href: '/pix/keys',
                            icon: PlusCircle,
                        },
                    ].map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#fde7de]/70 via-white/0 to-transparent opacity-0 transition group-hover:opacity-100" />
                            <div className="relative z-10 space-y-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fde2d8] text-[#b91c3a]">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-foreground">
                                    {item.title}
                                </p>
                            </div>
                        </Link>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">
                                Ultimas movimentações
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                Hoje
                            </span>
                        </div>
                        <div className="mt-4 space-y-4">
                            {loading && (
                                <p className="text-sm text-muted-foreground">
                                    Carregando historico...
                                </p>
                            )}
                            {error && (
                                <p className="text-sm text-red-600">{error}</p>
                            )}
                            {!loading &&
                                data?.transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.type.toUpperCase()}
                                            </p>
                                        </div>
                                        <div
                                            className={`text-sm font-semibold ${
                                                transaction.direction ===
                                                'credit'
                                                    ? 'text-emerald-600'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            {transaction.direction === 'debit'
                                                ? '-'
                                                : '+'}
                                            {hideValues
                                                ? '••••'
                                                : formatCurrency(
                                                      transaction.amount_cents,
                                                  )}
                                        </div>
                                    </div>
                                ))}
                            {!loading &&
                                data?.transactions?.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Nenhuma movimentacao registrada ainda.
                                    </p>
                                )}
                        </div>
                    </div>

                    <div className="rounded-3xl border h-fit border-white/70 bg-gradient-to-br from-[#fde7de] via-white to-white p-6 text-foreground shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Cartão digital
                            </p>
                            <CreditCard className="h-5 w-5 text-[#b91c3a]" />
                        </div>
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Limite disponivel
                            </p>
                            <p className="text-2xl font-semibold">
                                {maskedLimit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Pagamento minimo: {maskedMinimum}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
                            <span>VIRTUAL</span>
                            <span>{maskedCardSuffix}</span>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
