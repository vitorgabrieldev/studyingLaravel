import AppLayout from '@/layouts/app-layout';
import { formatCurrency, getCsrfHeaders, toCents } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    PlusCircle,
    RefreshCcw,
    ShieldCheck,
    Unlock,
    Lock,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cartões',
        href: '/cartoes',
    },
];

type Card = {
    id: number;
    type: 'physical' | 'virtual';
    status: 'active' | 'blocked';
    nickname: string | null;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    limit_cents: number;
    international_enabled: boolean;
    online_enabled: boolean;
    contactless_enabled: boolean;
    replaced_at: string | null;
};

type RevealData = {
    pan: string;
    cvv: string;
    exp_month: number;
    exp_year: number;
};

export default function CardsIndex({
    cards,
    travelModeEnabled: initialTravelModeEnabled,
}: {
    cards: Card[];
    travelModeEnabled: boolean;
}) {
    const [cardList, setCardList] = useState<Card[]>(cards ?? []);
    const [travelModeEnabled, setTravelModeEnabled] = useState(
        initialTravelModeEnabled ?? false,
    );
    const [creating, setCreating] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [newLimit, setNewLimit] = useState('');
    const [revealCard, setRevealCard] = useState<Card | null>(null);
    const [revealPassword, setRevealPassword] = useState('');
    const [revealData, setRevealData] = useState<RevealData | null>(null);
    const [revealError, setRevealError] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const physicalCard = useMemo(
        () => cardList.find((card) => card.type === 'physical') ?? null,
        [cardList],
    );
    const virtualCards = useMemo(
        () => cardList.filter((card) => card.type === 'virtual'),
        [cardList],
    );

    const refreshCards = async () => {
        const response = await fetch('/api/cards', {
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        const payload = await response.json();
        setCardList(payload.cards ?? []);
    };

    const toggleTravelMode = async (enabled: boolean) => {
        setTravelModeEnabled(enabled);
        await fetch('/api/travel-mode', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({ enabled }),
        });
        await refreshCards();
    };

    const updateCard = (updated: Card) => {
        setCardList((prev) =>
            prev.map((card) => (card.id === updated.id ? updated : card)),
        );
    };

    const handleSettingsChange = async (card: Card, next: Partial<Card>) => {
        const payload = {
            international_enabled:
                next.international_enabled ?? card.international_enabled,
            online_enabled: next.online_enabled ?? card.online_enabled,
            contactless_enabled:
                next.contactless_enabled ?? card.contactless_enabled,
        };

        updateCard({ ...card, ...payload });

        await fetch(`/api/cards/${card.id}/settings`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
            body: JSON.stringify(payload),
        });
    };

    const handleBlock = async (card: Card) => {
        setLoadingAction(true);
        await fetch(`/api/cards/${card.id}/block`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
        });
        await refreshCards();
        setLoadingAction(false);
    };

    const handleUnblock = async (card: Card) => {
        setLoadingAction(true);
        await fetch(`/api/cards/${card.id}/unblock`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
        });
        await refreshCards();
        setLoadingAction(false);
    };

    const handleReplace = async (card: Card) => {
        setLoadingAction(true);
        await fetch(`/api/cards/${card.id}/replace`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
        });
        await refreshCards();
        setLoadingAction(false);
    };

    const handleCreateVirtual = async () => {
        setCreating(true);
        const limitCents = newLimit ? toCents(newLimit) : null;

        await fetch('/api/cards', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({
                nickname: newNickname || null,
                limit_cents: limitCents,
            }),
        });
        setNewNickname('');
        setNewLimit('');
        await refreshCards();
        setCreating(false);
    };

    const handleReveal = async () => {
        if (!revealCard) {
            return;
        }

        setRevealError(null);
        setRevealData(null);
        setLoadingAction(true);

        const response = await fetch(`/api/cards/${revealCard.id}/reveal`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...getCsrfHeaders(),
            },
            body: JSON.stringify({
                password: revealPassword,
            }),
        });

        const payload = await response.json();

        if (!response.ok) {
            setRevealError(payload.message ?? 'Senha invalida.');
        } else {
            setRevealData(payload);
        }

        setLoadingAction(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cartões" />

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Cartão físico
                            </p>
                            <h2 className="text-xl font-semibold text-foreground">
                                {physicalCard?.nickname ?? 'Cartão principal'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {physicalCard
                                    ? `${physicalCard.brand} •••• ${physicalCard.last4}`
                                    : 'Gerando cartão...'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {physicalCard?.status === 'blocked' ? (
                                <Button
                                    onClick={() =>
                                        physicalCard &&
                                        handleUnblock(physicalCard)
                                    }
                                    disabled={loadingAction}
                                >
                                    <Unlock className="h-4 w-4" />
                                    Desbloquear
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        physicalCard &&
                                        handleBlock(physicalCard)
                                    }
                                    disabled={loadingAction}
                                >
                                    <Lock className="h-4 w-4" />
                                    Bloquear
                                </Button>
                            )}
                            {physicalCard && (
                                <Button
                                    variant="outline"
                                    onClick={() => handleReplace(physicalCard)}
                                    disabled={loadingAction}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                    Pedir outro
                                </Button>
                            )}
                        </div>
                    </div>

                    {physicalCard && (
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Limite
                                </p>
                                <p className="mt-2 text-lg font-semibold text-foreground">
                                    {formatCurrency(physicalCard.limit_cents)}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Compras online
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Ativo
                                    </span>
                                    <Switch
                                        checked={physicalCard.online_enabled}
                                        onCheckedChange={(checked) =>
                                            handleSettingsChange(
                                                physicalCard,
                                                { online_enabled: checked },
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Compras no exterior
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Internacional
                                    </span>
                                    <Switch
                                        checked={
                                            physicalCard.international_enabled
                                        }
                                        onCheckedChange={(checked) =>
                                            handleSettingsChange(
                                                physicalCard,
                                                {
                                                    international_enabled:
                                                        checked,
                                                },
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 md:col-span-3">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Contactless
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Aproximação
                                    </span>
                                    <Switch
                                        checked={
                                            physicalCard.contactless_enabled
                                        }
                                        onCheckedChange={(checked) =>
                                            handleSettingsChange(
                                                physicalCard,
                                                {
                                                    contactless_enabled: checked,
                                                },
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Modo viagem
                            </p>
                            <h2 className="text-lg font-semibold text-foreground">
                                Compras internacionais liberadas
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Ative antes de viagens para evitar bloqueios de
                                segurança.
                            </p>
                        </div>
                        <Switch
                            checked={travelModeEnabled}
                            onCheckedChange={toggleTravelMode}
                        />
                    </div>
                </section>

                <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Cartões virtuais
                            </p>
                            <h2 className="text-lg font-semibold text-foreground">
                                Seus cartões digitais
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Crie cartões com limites diferentes.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            Dados protegidos
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-4">
                            {virtualCards.length === 0 && (
                                <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm text-muted-foreground">
                                    Nenhum cartão virtual criado.
                                </div>
                            )}
                            {virtualCards.map((card) => (
                                <div
                                    key={card.id}
                                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 p-4"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {card.nickname ?? 'Cartão virtual'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {card.brand} •••• {card.last4} ·{' '}
                                            {String(card.exp_month).padStart(
                                                2,
                                                '0',
                                            )}
                                            /{card.exp_year}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Limite:{' '}
                                            {formatCurrency(card.limit_cents)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {card.status === 'blocked' ? (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    handleUnblock(card)
                                                }
                                                disabled={loadingAction}
                                            >
                                                <Unlock className="h-4 w-4" />
                                                Desbloquear
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    handleBlock(card)
                                                }
                                                disabled={loadingAction}
                                            >
                                                <Lock className="h-4 w-4" />
                                                Bloquear
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setRevealCard(card);
                                                setRevealPassword('');
                                                setRevealData(null);
                                                setRevealError(null);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                            Mostrar dados
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/70 p-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <PlusCircle className="h-4 w-4" />
                                Criar cartão virtual
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="nickname">Nome</Label>
                                    <Input
                                        id="nickname"
                                        value={newNickname}
                                        onChange={(event) =>
                                            setNewNickname(event.target.value)
                                        }
                                        placeholder="Ex: Streaming"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="limit">
                                        Limite do cartão
                                    </Label>
                                    <Input
                                        id="limit"
                                        value={newLimit}
                                        onChange={(event) =>
                                            setNewLimit(event.target.value)
                                        }
                                        placeholder="R$ 300,00"
                                        inputMode="decimal"
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleCreateVirtual}
                                    disabled={creating}
                                >
                                    Criar cartão
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Dialog
                open={Boolean(revealCard)}
                onOpenChange={(open) => {
                    if (!open) {
                        setRevealCard(null);
                        setRevealPassword('');
                        setRevealData(null);
                        setRevealError(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar senha</DialogTitle>
                        <DialogDescription>
                            Para ver os dados do cartão virtual, confirme sua
                            senha.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label htmlFor="card-password">Senha da conta</Label>
                        <Input
                            id="card-password"
                            type="password"
                            value={revealPassword}
                            onChange={(event) =>
                                setRevealPassword(event.target.value)
                            }
                        />
                        {revealError && (
                            <p className="text-sm text-red-600">
                                {revealError}
                            </p>
                        )}

                        {revealData && (
                            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm">
                                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    Dados do cartão
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {revealData.pan}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Validade{' '}
                                    {String(revealData.exp_month).padStart(
                                        2,
                                        '0',
                                    )}
                                    /{revealData.exp_year}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    CVV {revealData.cvv}
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setRevealCard(null)}
                        >
                            Fechar
                        </Button>
                        <Button onClick={handleReveal} disabled={loadingAction}>
                            {revealData ? (
                                <>
                                    <EyeOff className="h-4 w-4" />
                                    Atualizar dados
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" />
                                    Mostrar dados
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
