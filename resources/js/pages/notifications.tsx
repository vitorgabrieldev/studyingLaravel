import AppLayout from '@/layouts/app-layout';
import { getCsrfHeaders } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notificações',
        href: '/notificacoes',
    },
];

type Notification = {
    id: number;
    title: string;
    body: string | null;
    type: string;
    read_at: string | null;
    created_at: string | null;
};

export default function Notifications() {
    const [items, setItems] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/notifications', {
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((res) => res.json())
            .then((payload) => setItems(payload.notifications ?? []))
            .finally(() => setLoading(false));
    }, []);

    const markAllRead = async () => {
        await fetch('/api/notifications/read-all', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
        });
        setItems((prev) =>
            prev.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })),
        );
    };

    const markRead = async (id: number) => {
        await fetch(`/api/notifications/${id}/read`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
        });
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, read_at: item.read_at ?? new Date().toISOString() }
                    : item,
            ),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notificações" />
            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Central
                            </p>
                            <h1 className="text-2xl font-semibold text-foreground">
                                Notificações
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Acompanhe eventos do seu banco em tempo real.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-semibold text-[#b91c3a] transition hover:bg-[#fde2d8]"
                        >
                            Marcar todas como lidas
                        </button>
                    </div>
                </section>

                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    {loading && (
                        <p className="text-sm text-muted-foreground">
                            Carregando notificações...
                        </p>
                    )}
                    {!loading && items.length === 0 && (
                        <div className="rounded-2xl border border-white/70 bg-white/70 p-5 text-sm text-muted-foreground">
                            Nenhuma notificação por enquanto.
                        </div>
                    )}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#fde2d8] text-[#b91c3a]">
                                        {item.read_at ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <Bell className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {item.title}
                                        </p>
                                        {item.body && (
                                            <p className="text-xs text-muted-foreground">
                                                {item.body}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {!item.read_at && (
                                    <button
                                        type="button"
                                        onClick={() => markRead(item.id)}
                                        className="rounded-full border border-white/70 bg-white px-3 py-1 text-xs font-semibold text-[#b91c3a] transition hover:bg-[#fde2d8]"
                                    >
                                        Marcar como lida
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
