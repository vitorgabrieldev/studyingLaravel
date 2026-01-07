import AppLogo from '@/components/app-logo';
import { Head, Link } from '@inertiajs/react';
import { Brain, ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function About() {
    return (
        <>
            <Head title="Sobre" />
            <div className="relative min-h-screen overflow-hidden bg-[#fdf7f3] text-[#230f2b]">
                <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,29,65,0.25),rgba(242,29,65,0))] blur-3xl" />
                <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(35,15,43,0.2),rgba(35,15,43,0))] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(235,235,188,0.5),rgba(235,235,188,0))] blur-3xl" />

                <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <AppLogo />
                    </Link>
                    <nav className="flex w-full flex-wrap items-center gap-3 text-sm text-[#4b3b70] sm:w-auto sm:justify-end">
                        <Link href="/faq" className="hover:text-[#230f2b]">
                            FAQ
                        </Link>
                        <Link href="/politicas" className="hover:text-[#230f2b]">
                            Políticas
                        </Link>
                        <Link href="/contato" className="hover:text-[#230f2b]">
                            Contato
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-8">
                    <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Sobre a Fintech.laravel
                            </p>
                            <h1 className="mt-3 text-3xl font-semibold text-[#1b1230] md:text-4xl">
                                Uma fintech criada para dar clareza, controle e
                                leveza à sua vida financeira.
                            </h1>
                            <p className="mt-4 text-sm text-[#5a4a79]">
                                Nascemos digitais e obcecados por experiência.
                                A Fintech.laravel une tecnologia, segurança e
                                atendimento humano para transformar a forma
                                como você movimenta seu dinheiro.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                {[
                                    'Conta digital completa',
                                    'Pix, boletos e cartões',
                                    'Insights com IA',
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[#b91c3a]"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-4">
                            {[
                                {
                                    icon: Sparkles,
                                    title: 'Experiência fluida',
                                    description:
                                        'Fluxos simples, linguagem clara e design elegante.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Segurança em camadas',
                                    description:
                                        'Proteções inteligentes e notificações em tempo real.',
                                },
                                {
                                    icon: Brain,
                                    title: 'IA para finanças',
                                    description:
                                        'Sugestões e insights para decisões mais inteligentes.',
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur"
                                >
                                    <item.icon className="h-5 w-5 text-[#b91c3a]" />
                                    <h3 className="mt-3 text-sm font-semibold text-[#1b1230]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-xs text-[#6b5d87]">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                title: '+2M usuários',
                                description:
                                    'Pessoas que confiam em nossa experiência digital.',
                            },
                            {
                                title: '99,9% uptime',
                                description:
                                    'Infraestrutura estável para operar 24/7.',
                            },
                            {
                                title: 'Atendimento humano',
                                description:
                                    'Equipe dedicada para resolver rápido.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur"
                            >
                                <p className="text-lg font-semibold text-[#1b1230]">
                                    {item.title}
                                </p>
                                <p className="mt-2 text-xs text-[#6b5d87]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-[#b91c3a]" />
                            <h2 className="text-lg font-semibold text-[#1b1230]">
                                Nossa missão
                            </h2>
                        </div>
                        <p className="mt-3 text-sm text-[#5a4a79]">
                            Democratizar o acesso a uma experiência financeira
                            moderna, transparente e conectada ao dia a dia.
                        </p>
                    </section>
                </main>
            </div>
        </>
    );
}
