import AppLogo from '@/components/app-logo';
import { Head, Link } from '@inertiajs/react';
import { HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

const faqItems = [
    {
        question: 'A Fintech.laravel é um banco real?',
        answer:
            'Somos uma fintech digital fictícia criada para simular a experiência de um banco moderno com foco em UX.',
    },
    {
        question: 'O que posso fazer dentro do app?',
        answer:
            'Você pode realizar Pix, pagamentos, transferências, gerenciar cartões, extrato e notificações.',
    },
    {
        question: 'Como funciona a segurança?',
        answer:
            'O projeto simula camadas de segurança como bloqueios, confirmações e alertas internos.',
    },
    {
        question: 'Como funcionam cartões e limites?',
        answer:
            'Há cartão físico e virtual com limites e controles como compras internacionais e online.',
    },
];

export default function Faq() {
    return (
        <>
            <Head title="FAQ" />
            <div className="relative min-h-screen overflow-hidden bg-[#fdf7f3] text-[#230f2b]">
                <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,29,65,0.25),rgba(242,29,65,0))] blur-3xl" />
                <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(35,15,43,0.2),rgba(35,15,43,0))] blur-3xl" />

                <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <AppLogo />
                    </Link>
                    <nav className="flex w-full flex-wrap items-center gap-3 text-sm text-[#4b3b70] sm:w-auto sm:justify-end">
                        <Link href="/sobre" className="hover:text-[#230f2b]">
                            Sobre
                        </Link>
                        <Link href="/contato" className="hover:text-[#230f2b]">
                            Contato
                        </Link>
                        <Link href="/politicas" className="hover:text-[#230f2b]">
                            Políticas
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-8">
                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            FAQ
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold">
                            Dúvidas frequentes
                        </h1>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Tudo o que você precisa para entender a experiência
                            Fintech.laravel.
                        </p>
                    </section>

                    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-3">
                            {faqItems.map((item) => (
                                <details
                                    key={item.question}
                                    className="group rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[#1b1230]">
                                        {item.question}
                                        <span className="text-xs text-[#b91c3a] transition group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-xs text-[#6b5d87]">
                                        {item.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                        <div className="grid gap-4">
                            {[
                                {
                                    icon: HelpCircle,
                                    title: 'Central inteligente',
                                    description:
                                        'Ajuda contextual e respostas rápidas.',
                                },
                                {
                                    icon: ShieldCheck,
                                    title: 'Segurança ativa',
                                    description:
                                        'Alertas e confirmações para cada ação.',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'UX simplificada',
                                    description:
                                        'Fluxos claros e linguagem direta.',
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
                </main>
            </div>
        </>
    );
}
