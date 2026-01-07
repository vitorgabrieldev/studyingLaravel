import AppLogo from '@/components/app-logo';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Bot, CreditCard, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative min-h-svh overflow-hidden bg-[#f7f3ff] text-[#1a1026]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.55),rgba(124,58,237,0))] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),rgba(168,85,247,0))] blur-3xl" />

            <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:gap-16">
                <div className="flex-1 space-y-8">
                    <Link href={home()} className="inline-flex items-center gap-3">
                        <AppLogo />
                    </Link>

                    <div className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#6d28d9]">
                            Fintech.laravel
                        </p>
                        <h1 className="text-3xl font-semibold leading-tight text-[#1b1230] md:text-4xl">
                            Banco digital inteligente com controle total da sua
                            rotina financeira.
                        </h1>
                        <p className="max-w-lg text-base text-[#4b3b70]">
                            Gerencie saldo, Pix, boletos e transferências em um
                            único lugar, com a mesma simplicidade que você
                            espera de um app moderno.
                        </p>
                    </div>

                    <div className="grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                            {
                                title: 'Pix instantâneo',
                                description: 'Envios e recebimentos em segundos.',
                                icon: Zap,
                                tone: 'text-[#b91c3a]',
                            },
                            {
                                title: 'Cartões inteligentes',
                                description: 'Cartões virtuais com limites por uso.',
                                icon: CreditCard,
                                tone: 'text-[#6d28d9]',
                            },
                            {
                                title: 'Pagamentos fluidos',
                                description: 'Boletos e transferências sem fricção.',
                                icon: Sparkles,
                                tone: 'text-[#ef4444]',
                            },
                            {
                                title: 'Segurança com IA',
                                description: 'Proteções multicamadas e alertas inteligentes.',
                                icon: Bot,
                                tone: 'text-[#b91c3a]',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-white/50 bg-white/60 p-4 text-sm text-[#2a1f45] shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg active:scale-95"
                            >
                                <item.icon className={`h-5 w-5 ${item.tone}`} />
                                <p className="mt-3 text-sm font-semibold">
                                    {item.title}
                                </p>
                                <p className="mt-1 text-xs text-[#6b5d87]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-[43%]">
                    <div className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-[#1b1230]">
                                {title}
                            </h2>
                            <p className="text-sm text-[#5a4a79]">
                                {description}
                            </p>
                        </div>
                        <div className="mt-6">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
