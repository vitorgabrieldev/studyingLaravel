import AppLogo from '@/components/app-logo';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Bot,
    Brain,
    Building2,
    Cpu,
    LineChart,
    Rocket,
    ShieldCheck,
    Sparkles,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Fintech.laravel" />
            <div className="relative min-h-screen overflow-hidden bg-[#f7f3ff] text-[#1a1026]">
                <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.55),rgba(139,92,246,0))] blur-3xl animate-float-slow" />
                <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.5),rgba(168,85,247,0))] blur-3xl animate-float-medium" />
                <div className="pointer-events-none absolute bottom-0 left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.35),rgba(124,58,237,0))] blur-3xl animate-float-fast" />
                <div className="pointer-events-none absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.4),rgba(147,51,234,0))] blur-3xl animate-glow" />

                <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={dashboard()} className="inline-flex items-center">
                        <AppLogo />
                    </Link>
                    <nav className="flex w-full flex-wrap items-center gap-2 text-sm sm:w-auto sm:justify-end">
                        <Link
                            href="/sobre"
                            className="rounded-full px-3 py-2 text-[#4b3b70] transition hover:text-[#2a1f45] hover:-translate-y-0.5 active:scale-95"
                        >
                            Sobre
                        </Link>
                        <Link
                            href="/faq"
                            className="rounded-full px-3 py-2 text-[#4b3b70] transition hover:text-[#2a1f45] hover:-translate-y-0.5 active:scale-95"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/contato"
                            className="rounded-full px-3 py-2 text-[#4b3b70] transition hover:text-[#2a1f45] hover:-translate-y-0.5 active:scale-95"
                        >
                            Contato
                        </Link>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full border border-white/70 bg-white/70 px-4 py-2 font-medium text-[#2a1f45] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                            >
                                Ir para o app
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full px-4 py-2 text-[#4b3b70] transition hover:text-[#2a1f45] hover:-translate-y-0.5 active:scale-95"
                                >
                                    Entrar
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-full text-white bg-primary px-4 py-2 font-medium text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
                                    >
                                        Abrir conta
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-8">
                    <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#6d28d9] animate-fade-up">
                                Fintech.laravel
                            </div>
                            <h1 className="text-4xl font-semibold leading-tight text-[#1b1230] md:text-5xl animate-fade-up">
                                Seu banco digital com inteligência e atitude.
                            </h1>
                            <p className="max-w-xl text-base text-[#4b3b70] animate-fade-up">
                                Controle saldo, Pix, boletos e transferências
                                com uma interface moderna, animada e direta ao
                                ponto. Tudo em um único app.
                            </p>
                            <div className="flex flex-wrap gap-3 animate-fade-up">
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm text-white font-semibold text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
                                    >
                                        Quero abrir minha conta
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                )}
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-3 text-sm font-semibold text-[#2a1f45] transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                >
                                    Já tenho conta
                                </Link>
                            </div>

                            <br></br>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        title: 'Pix instantâneo',
                                        description:
                                            'Envios e recebimentos em segundos.',
                                        icon: Wallet,
                                    },
                                    {
                                        title: 'Gestão inteligente',
                                        description:
                                            'Seu dinheiro organizado em um lugar.',
                                        icon: Sparkles,
                                    },
                                    {
                                        title: 'Boletos e contas',
                                        description:
                                            'Pague com segurança e rapidez.',
                                        icon: ShieldCheck,
                                    },
                                    {
                                        title: 'Transferências internas',
                                        description:
                                            'Para usuários Fintech.laravel sem tarifas.',
                                        icon: ArrowRight,
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={item.title}
                                        className="group rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-up"
                                        style={{
                                            animationDelay: `${index * 0.05}s`,
                                        }}
                                    >
                                        <item.icon className="h-5 w-5 text-[#5b21b6]" />
                                        <h3 className="mt-3 text-sm font-semibold text-[#2a1f45]">
                                            {item.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-[#6b5d87]">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative animate-fade-right">
                            <div className="absolute -left-8 top-8 h-44 w-44 rounded-full bg-[#c4b5fd] opacity-40 blur-3xl animate-float-medium" />
                            <div className="relative rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-2xl backdrop-blur">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-[0.3em] text-[#6b5d87]">
                                        painel
                                    </span>
                                    <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-[#4b3b70]">
                                        Fintech.laravel Prime
                                    </span>
                                </div>
                                <div className="mt-10">
                                    <p className="text-sm text-[#6b5d87]">
                                        Saldo disponível
                                    </p>
                                    <p className="mt-2 text-3xl font-semibold text-[#1b1230]">
                                        R$ 12.450,90
                                    </p>
                                </div>
                                <div className="mt-10 grid grid-cols-2 gap-3 text-xs text-[#6b5d87]">
                                    <div className="rounded-2xl border border-white/70 bg-white/70 p-3">
                                        Pix rápido
                                        <p className="mt-2 text-sm font-semibold text-[#2a1f45]">
                                            R$ 1.250,00
                                        </p>
                                    </div>
                                    <div className="rounded-2xl border border-white/70 bg-white/70 p-3">
                                        Boleto pago
                                        <p className="mt-2 text-sm font-semibold text-[#2a1f45]">
                                            R$ 320,00
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-6 text-xs text-[#7b6a99]">
                                    Projeto de estudo inspirado em bancos digitais.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16 grid gap-4 md:grid-cols-3">
                        {[
                            {
                                label: 'Clientes ativos',
                                value: '320k+',
                                icon: Users,
                            },
                            {
                                label: 'Transações por dia',
                                value: '1.2M',
                                icon: LineChart,
                            },
                            {
                                label: 'Score de segurança',
                                value: '99.9%',
                                icon: BadgeCheck,
                            },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-95 animate-fade-up"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <stat.icon className="h-5 w-5 text-[#5b21b6]" />
                                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#7b6a99]">
                                    {stat.label}
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-[#1b1230]">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="mt-16 grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d28d9]">
                                Sobre
                            </p>
                            <h2 className="text-3xl font-semibold text-[#1b1230]">
                                Uma experiência bancária feita para ritmo real.
                            </h2>
                            <p className="text-sm text-[#5a4a79]">
                                A Fintech.laravel nasce para quem não quer perder tempo com
                                telas antigas. Tudo foi desenhado para ser
                                rápido, claro e bonito: do extrato à
                                transferência, do Pix à gestão de limites.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    'Conta digital completa',
                                    'Suporte humano e rápido',
                                    'Operações em tempo real',
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs text-[#4b3b70]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/60 bg-gradient-to-br from-white via-[#efe8ff] to-white p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-[0.3em] text-[#7b6a99]">
                                    suporte
                                </span>
                                <Zap className="h-5 w-5 text-[#5b21b6]" />
                            </div>
                            <div className="mt-6 space-y-3">
                                {[
                                    {
                                        title: 'Chat 24/7',
                                        desc: 'Atendimento real com foco em resolucao.',
                                    },
                                    {
                                        title: 'Notificacoes inteligentes',
                                        desc: 'Tudo que importa chega em tempo real.',
                                    },
                                    {
                                        title: 'Alertas de segurança',
                                        desc: 'Monitoramento ativo para evitar riscos.',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-white/60 bg-white/70 p-4"
                                    >
                                        <p className="text-sm font-semibold text-[#2a1f45]">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-xs text-[#6b5d87]">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-16">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d28d9]">
                                    AI Finance
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-[#1b1230]">
                                    Integracoes com AI para automacao financeira
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm text-[#5a4a79]">
                                    O assistente Fintech.laravel cruza seu comportamento de
                                    gasto com objetivos pessoais e oferece
                                    sugestoes praticas sem complicar sua rotina.
                                </p>
                            </div>
                            {canRegister ? (
                                <Link
                                    href={register()}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#2a1f45] transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                >
                                    Conhecer agora
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-[#2a1f45] transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                >
                                    Entrar no app
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {[
                                {
                                    title: 'Diagnostico financeiro',
                                    description:
                                        'Entenda padroes, cortes e oportunidades.',
                                    icon: Brain,
                                },
                                {
                                    title: 'Planejamento inteligente',
                                    description:
                                        'Metas automaticas baseadas no seu fluxo.',
                                    icon: LineChart,
                                },
                                {
                                    title: 'Alertas proativos',
                                    description:
                                        'Avisos antes de imprevistos acontecerem.',
                                    icon: Bot,
                                },
                            ].map((item, index) => (
                                <div
                                    key={item.title}
                                    className="group rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg active:scale-95"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ede9fe] text-[#5b21b6]">
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-semibold text-[#2a1f45]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-xs text-[#6b5d87]">
                                        {item.description}
                                    </p>
                                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#7b6a99]">
                                        AI integrado
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-[#5b21b6]" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-[#6d28d9]">
                                    Empresas que confiam
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 text-sm text-[#4b3b70] sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                'Aurora Labs',
                                'NovaPay',
                                'Atlas Media',
                                'Pulse Systems',
                                'Cobalt Logistics',
                                'Verde Capital',
                                'Orion Tech',
                                'Lumen Health',
                            ].map((name) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-center rounded-2xl select-none border border-black/10 bg-white/70 px-4 py-5 font-semibold uppercase tracking-[0.2em] text-[#5a4a79] transition hover:-translate-y-1 hover:shadow-lg active:scale-95 cursor-pointer"
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-[#ede9fe] via-white to-white p-8 shadow-lg">
                            <div className="flex items-center gap-3">
                                <Cpu className="h-5 w-5 text-[#5b21b6]" />
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d28d9]">
                                    Tecnologia
                                </p>
                            </div>
                            <h2 className="mt-4 text-3xl font-semibold text-[#1b1230]">
                                Infra pronta para crescer com você.
                            </h2>
                            <p className="mt-3 text-sm text-[#5a4a79]">
                                Infraestrutura em camadas, escalavel e com
                                automacao completa para sua vida financeira.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {[
                                    'Pix 24/7',
                                    'APIs seguras',
                                    'Monitoramento ativo',
                                    'KYC inteligente',
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs text-[#4b3b70]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-lg">
                            <div className="flex items-center gap-3">
                                <Rocket className="h-5 w-5 text-[#5b21b6]" />
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#6d28d9]">
                                    Comece agora
                                </p>
                            </div>
                            <p className="mt-4 text-sm text-[#5a4a79]">
                                Abra sua conta e teste as funcoes que estao
                                mudando a forma como você gerencia seu dinheiro.
                            </p>
                            <div className="mt-6 space-y-3 text-sm text-[#4b3b70]">
                                {[
                                    'Cadastro rápido e transparente',
                                    'Conta digital e cartão virtual',
                                    'AI para automatizar suas metas',
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-2"
                                    >
                                        <ShieldCheck className="h-4 w-4 text-[#5b21b6]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                            {canRegister ? (
                                <Link
                                    href={register()}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95 text-white"
                                >
                                    Criar conta
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-3 text-sm font-semibold text-[#2a1f45] transition hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                                >
                                    Entrar no app
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
