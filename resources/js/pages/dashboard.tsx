import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CreditCard,
    FileText,
    PlusCircle,
    Send,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/dashboard', {
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Falha ao carregar dados.');
                }

                return response.json();
            })
            .then((payload) => {
                if (isMounted) {
                    setData(payload);
                    setError(null);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const accountLabel = data
        ? `${data.account.branch_number} / ${data.account.account_number}-${data.account.account_digit}`
        : '--';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="flex flex-1 flex-col gap-6 overflow-x-auto p-6 md:p-8">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#a855f7] p-8 text-white shadow-xl">
                    <div className="absolute -right-16 -top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-12 left-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative z-10 space-y-4">
                        <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                            saldo atual
                        </p>
                        <div className="text-3xl font-semibold md:text-4xl">
                            {loading
                                ? 'Carregando...'
                                : data
                                  ? formatCurrency(
                                        data.account.balance_cents,
                                    )
                                  : formatCurrency(0)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                            <span>Ag/Conta</span>
                            <span className="rounded-full border border-white/30 px-3 py-1 text-xs">
                                {accountLabel}
                            </span>
                        </div>
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
                            className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-white/0 to-transparent opacity-0 transition group-hover:opacity-100" />
                            <div className="relative z-10 space-y-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ede9fe] text-[#5b21b6]">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-[#2a1f45]">
                                    {item.title}
                                </p>
                            </div>
                        </Link>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1b1230]">
                                Ultimas movimentacoes
                            </h2>
                            <span className="text-sm text-[#6b5d87]">
                                Hoje
                            </span>
                        </div>
                        <div className="mt-4 space-y-4">
                            {loading && (
                                <p className="text-sm text-[#6b5d87]">
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
                                            <p className="text-sm font-medium text-[#2a1f45]">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-[#7b6a99]">
                                                {transaction.type.toUpperCase()}
                                            </p>
                                        </div>
                                        <div
                                            className={`text-sm font-semibold ${
                                                transaction.direction ===
                                                'credit'
                                                    ? 'text-emerald-600'
                                                    : 'text-[#2a1f45]'
                                            }`}
                                        >
                                            {transaction.direction === 'debit'
                                                ? '-'
                                                : '+'}
                                            {formatCurrency(
                                                transaction.amount_cents,
                                            )}
                                        </div>
                                    </div>
                                ))}
                            {!loading &&
                                data?.transactions?.length === 0 && (
                                    <p className="text-sm text-[#6b5d87]">
                                        Nenhuma movimentacao registrada ainda.
                                    </p>
                                )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-[#ede9fe] via-white to-white p-6 text-[#2a1f45] shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.3em] text-[#7b6a99]">
                                cartao digital
                            </p>
                            <CreditCard className="h-5 w-5 text-[#5b21b6]" />
                        </div>
                        <div className="mt-6 space-y-2">
                            <p className="text-sm text-[#6b5d87]">
                                Limite disponivel
                            </p>
                            <p className="text-2xl font-semibold">
                                {formatCurrency(120000)}
                            </p>
                            <p className="text-xs text-[#7b6a99]">
                                Pagamento minimo: {formatCurrency(4200)}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center justify-between text-xs text-[#7b6a99]">
                            <span>VIRTUAL</span>
                            <span>*** 2451</span>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
