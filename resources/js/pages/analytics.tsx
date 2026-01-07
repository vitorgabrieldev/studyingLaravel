import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LineChart, Sparkles } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Painel',
        href: '/painel',
    },
];

type SeriesPoint = {
    label: string;
    credits: number;
    debits: number;
};

type LastTransaction = {
    description: string;
    amount_cents: number;
    direction: 'debit' | 'credit';
};

export default function Analytics({
    series,
    lastTransaction,
}: {
    series: SeriesPoint[];
    lastTransaction: LastTransaction | null;
}) {
    const maxValue = Math.max(
        ...series.map((point) => Math.max(point.credits, point.debits, 1)),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel financeiro" />
            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Painel financeiro
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground">
                                Panorama dos últimos meses
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Entradas e saídas organizadas para você tomar decisões.
                            </p>
                        </div>
                        <LineChart className="h-6 w-6 text-[#b91c3a]" />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/70 bg-white/70 p-5">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Entradas vs saídas
                            </p>
                            <div className="mt-4 grid grid-cols-6 gap-3">
                                {series.map((point) => (
                                    <div key={point.label} className="space-y-2">
                                        <div className="flex h-24 flex-col justify-end gap-2">
                                            <div
                                                className="rounded-full bg-emerald-500/80"
                                                style={{
                                                    height: `${Math.max(
                                                        6,
                                                        (point.credits / maxValue) * 100,
                                                    )}%`,
                                                }}
                                            />
                                            <div
                                                className="rounded-full bg-[#f21d41]/80"
                                                style={{
                                                    height: `${Math.max(
                                                        6,
                                                        (point.debits / maxValue) * 100,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-center text-[10px] text-muted-foreground">
                                            {point.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/70 p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <Sparkles className="h-4 w-4 text-[#b91c3a]" />
                                Insight rápido
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">
                                {lastTransaction
                                    ? `Sua última transação foi "${
                                          lastTransaction.description
                                      }" no valor de ${formatCurrency(
                                          lastTransaction.amount_cents,
                                      )}.`
                                    : 'Sem transações recentes para análise.'}
                            </p>
                            <div className="mt-4 rounded-2xl border border-white/70 bg-white p-4 text-xs text-muted-foreground">
                                Dica: categorize suas transações para entender onde
                                você mais gasta.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
