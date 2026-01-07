import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ReceiptText } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Extrato',
        href: '/transacoes',
    },
];

type Transaction = {
    id: number;
    type: string;
    direction: 'debit' | 'credit';
    amount_cents: number;
    description: string;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type TransactionsPayload = {
    data: Transaction[];
    links?: PaginationLink[];
};

type Account = {
    branch_number: string;
    account_number: string;
    account_digit: string;
    balance_cents: number;
};

export default function TransactionsIndex({
    transactions,
    account,
}: {
    transactions: TransactionsPayload;
    account: Account;
}) {
    const accountLabel = `${account.branch_number} / ${account.account_number}-${account.account_digit}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Extrato" />

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Conta
                            </p>
                            <p className="text-lg font-semibold text-foreground">
                                {accountLabel}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Saldo atual: {formatCurrency(account.balance_cents)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Últimas transações
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Veja os detalhes e gere comprovantes.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {transactions.data.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma transação registrada ainda.
                            </p>
                        )}

                        {transactions.data.map((transaction) => (
                            <>
                            <div
                                key={transaction.id}
                                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-4"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {transaction.type.toUpperCase()} •{' '}
                                        {transaction.created_at
                                            ? new Date(
                                                transaction.created_at,
                                            ).toLocaleString('pt-BR')
                                            : '--'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`text-sm font-semibold ${transaction.direction === 'credit'
                                                ? 'text-emerald-600'
                                                : 'text-foreground'
                                            }`}
                                    >
                                        {transaction.direction === 'debit'
                                            ? '-'
                                            : '+'}
                                        {formatCurrency(
                                            transaction.amount_cents,
                                        )}
                                    </span>
                                    <Link
                                        href={`/transacoes/${transaction.id}`}
                                        className="rounded-full border border-white/70 bg-white px-3 py-2 text-xs font-semibold text-[#b91c3a] transition hover:bg-[#fde2d8] active:scale-95"
                                    >
                                        Ver comprovante
                                    </Link>
                                </div>
                            </div>
                            <hr></hr>
                            </>
                        ))}
                    </div>

                    {transactions.links && transactions.links.length > 1 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {transactions.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url ?? '#'}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${link.active
                                            ? 'bg-[#f21d41] text-white'
                                            : 'border border-white/70 bg-white text-[#b91c3a] hover:bg-[#fde2d8]'
                                        } ${link.url ? '' : 'pointer-events-none opacity-50'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
