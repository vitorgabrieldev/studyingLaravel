import AppLayout from '@/layouts/app-layout';
import { getCsrfHeaders } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { KeyRound, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Chaves Pix', href: '/pix/keys' },
];

type PixKey = {
    id: number;
    type: string;
    key: string;
    created_at: string;
};

export default function PixKeys() {
    const { auth } = usePage<SharedData>().props;
    const [keys, setKeys] = useState<PixKey[]>([]);
    const [type, setType] = useState('email');
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadKeys = () => {
        setLoading(true);
        fetch('/api/pix/keys', {
            credentials: 'include',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((response) => response.json())
            .then((payload) => setKeys(payload.keys ?? []))
            .catch(() => setKeys([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadKeys();
    }, []);

    useEffect(() => {
        if (type === 'random') {
            setKey('');
            return;
        }

        if (type === 'email') {
            setKey(auth.user.email ?? '');
            return;
        }

        if (type === 'cpf') {
            setKey(auth.user.cpf ?? '');
            return;
        }

        if (type === 'phone') {
            setKey(auth.user.phone ?? '');
        }
    }, [type, auth.user.cpf, auth.user.email, auth.user.phone]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setMessage(null);

        if (type !== 'random' && !key.trim()) {
            setError('Atualize seu perfil para cadastrar esta chave.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/pix/keys', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...getCsrfHeaders(),
                },
                body: JSON.stringify({
                    type,
                    key: type === 'random' ? null : key,
                }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message ?? 'Erro ao cadastrar chave.');
            }

            setMessage(payload.message ?? 'Chave cadastrada.');
            setKey('');
            loadKeys();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        setMessage(null);

        try {
            const response = await fetch(`/api/pix/keys/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    ...getCsrfHeaders(),
                },
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message ?? 'Erro ao remover chave.');
            }

            setMessage(payload.message ?? 'Chave removida.');
            loadKeys();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro inesperado.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chaves Pix" />
            <div className="grid gap-6 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm"
                >
                    <div>
                        <h1 className="text-2xl font-semibold text-[#1b1230]">
                            Registrar chave
                        </h1>
                        <p className="text-sm text-[#6b5d87]">
                            Organize suas chaves Pix para receber rápido.
                        </p>
                    </div>

                    <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                        Tipo de chave
                        <select
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                            className="h-11 rounded-xl border border-white/80 bg-white/70 px-3 text-sm"
                        >
                            <option value="email">Email</option>
                            <option value="cpf">CPF</option>
                            <option value="phone">Telefone</option>
                            <option value="random">Aleatoria</option>
                        </select>
                    </label>

                    {type !== 'random' && (
                        <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                            Chave
                            <input
                                value={key}
                                onChange={(event) =>
                                    setKey(event.target.value)
                                }
                                readOnly
                                className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                                placeholder="Chave vinculada ao seu cadastro"
                            />
                        </label>
                    )}

                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 select-none rounded-[12px] bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95 disabled:opacity-70"
                    >
                        <Plus className="h-4 w-4" />
                        {submitting ? 'Salvando...' : 'Cadastrar chave'}
                    </button>
                </form>

                <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#1b1230]">
                            Suas chaves
                        </h2>
                        <span className="text-xs text-[#6b5d87]">
                            {loading
                                ? 'Carregando...'
                                : `${keys.length} chave(s)`}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {loading && (
                            <p className="text-sm text-[#6b5d87]">
                                Buscando chaves cadastradas...
                            </p>
                        )}
                        {!loading && keys.length === 0 && (
                            <p className="text-sm text-[#6b5d87]">
                                Nenhuma chave cadastrada.
                            </p>
                        )}
                        {keys.map((pixKey) => (
                            <div
                                key={pixKey.id}
                                className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ede9fe] text-[#5b21b6]">
                                        <KeyRound className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#7b6a99]">
                                            {pixKey.type}
                                        </p>
                                        <p className="break-all text-sm font-medium text-[#2a1f45]">
                                            {pixKey.key}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(pixKey.id)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/80 text-[#8b5cf6] transition hover:-translate-y-0.5 hover:bg-[#f5f3ff] active:scale-95"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
