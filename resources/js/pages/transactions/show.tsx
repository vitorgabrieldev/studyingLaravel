import AppLayout from '@/layouts/app-layout';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Copy, Download, Share2, ChevronLeft} from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Extrato',
        href: '/transacoes',
    },
    {
        title: 'Comprovante',
        href: '#',
    },
];

type TransactionMeta = {
    barcode?: string | null;
    beneficiary_name?: string | null;
    counterparty?: {
        name?: string | null;
        branch_number?: string | null;
        account_number?: string | null;
        account_digit?: string | null;
    } | null;
    pix_key?: string | null;
};

type Transaction = {
    id: number;
    type: string;
    direction: 'debit' | 'credit';
    amount_cents: number;
    description: string;
    created_at: string | null;
    reference: string;
    meta: TransactionMeta;
};

type Account = {
    branch_number: string;
    account_number: string;
    account_digit: string;
};

export default function TransactionShow({
    transaction,
    account,
}: {
    transaction: Transaction;
    account: Account;
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get('print') === '1') {
            window.print();
        }
    }, []);

    const createdAt = transaction.created_at
        ? new Date(transaction.created_at).toLocaleString('pt-BR')
        : '--';

    const accountLabel = `${account.branch_number} / ${account.account_number}-${account.account_digit}`;
    const counterpartyLabel = transaction.meta.counterparty
        ? `${transaction.meta.counterparty.name ?? '---'} · ${
              transaction.meta.counterparty.branch_number ?? '---'
          }/${transaction.meta.counterparty.account_number ?? '---'}-${
              transaction.meta.counterparty.account_digit ?? '--'
          }`
        : null;

    const handleShare = async () => {
        if (typeof window === 'undefined') {
            return;
        }

        const shareData = {
            title: 'Comprovante Fintech.laravel',
            text: `Comprovante ${transaction.reference}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch {
            setCopied(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Comprovante" />

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/transacoes"
                        className="text-sm font-semibold text-[#b91c3a] transition flex items-center"
                    >
                        <ChevronLeft />
                        Voltar para o extrato
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() =>
                                        window.open(
                                            `${window.location.pathname}?print=1`,
                                            '_blank',
                                        )
                                    }
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold text-[#b91c3a] transition hover:-translate-y-0.5 hover:bg-[#fde2d8] active:scale-95"
                                >
                                    <Download className="h-4 w-4" />
                                    Baixar PDF
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Gera o PDF via impressao.
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold text-[#b91c3a] transition hover:-translate-y-0.5 hover:bg-[#fde2d8] active:scale-95"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Compartilhar
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Envia o link ou copia para você.
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (navigator.clipboard) {
                                            await navigator.clipboard.writeText(
                                                transaction.reference,
                                            );
                                            setCopied(true);
                                            setTimeout(
                                                () => setCopied(false),
                                                2000,
                                            );
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 cursor-pointer rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold text-[#b91c3a] transition hover:-translate-y-0.5 hover:bg-[#fde2d8] active:scale-95"
                                >
                                    <Copy className="h-4 w-4" />
                                    {copied ? 'Copiado' : 'Copiar referência'}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Copia a referencia para compartilhar.
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                <section className="print-area rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                comprovante
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground">
                                {transaction.description}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {createdAt}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-[#f7c7b8] bg-[#fde2d8] px-4 py-3 text-sm font-semibold text-[#b91c3a]">
                            {transaction.direction === 'debit'
                                ? 'Saida'
                                : 'Entrada'}
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                valor
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {formatCurrency(transaction.amount_cents)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Referencia {transaction.reference}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white p-4">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                sua conta
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">
                                {accountLabel}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tipo: {transaction.type.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {counterpartyLabel && (
                            <div className="rounded-2xl border border-white/70 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    destinatário
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {counterpartyLabel}
                                </p>
                            </div>
                        )}

                        {transaction.meta.beneficiary_name && (
                            <div className="rounded-2xl border border-white/70 bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    beneficiario
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {transaction.meta.beneficiary_name}
                                </p>
                            </div>
                        )}

                        {transaction.meta.barcode && (
                            <div className="rounded-2xl border border-white/70 bg-white p-4 md:col-span-2">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    codigo de barras
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {transaction.meta.barcode}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 rounded-2xl border border-dashed border-[#f7c7b8] bg-[#fff5f0] p-4 text-xs text-[#b91c3a]">
                        Este comprovante pode ser compartilhado. Para salvar em
                        PDF, use o botão "Baixar PDF".
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
