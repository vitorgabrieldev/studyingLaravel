import AppLogo from '@/components/app-logo';
import { Head, Link } from '@inertiajs/react';
import { FileCheck2, Lock, ShieldCheck } from 'lucide-react';

export default function Policies() {
    return (
        <>
            <Head title="Políticas" />
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
                        <Link href="/faq" className="hover:text-[#230f2b]">
                            FAQ
                        </Link>
                        <Link href="/contato" className="hover:text-[#230f2b]">
                            Contato
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-8">
                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Políticas
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold">
                            Termos de uso e privacidade
                        </h1>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Transparência total sobre uso, segurança e
                            privacidade de dados.
                        </p>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {[
                            {
                                icon: ShieldCheck,
                                title: 'Privacidade',
                                description:
                                    'Tratamos dados pessoais com respeito e utilizamos apenas o necessário para operar a conta.',
                            },
                            {
                                icon: Lock,
                                title: 'Segurança',
                                description:
                                    'Camadas de proteção, autenticação reforçada e alertas para ações sensíveis.',
                            },
                            {
                                icon: FileCheck2,
                                title: 'Uso aceitável',
                                description:
                                    'Conteúdos e operações devem respeitar nossos termos e boas práticas.',
                            },
                            {
                                icon: FileCheck2,
                                title: 'Cookies',
                                description:
                                    'Utilizamos cookies para manter sessões e melhorar a experiência no app.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur"
                            >
                                <item.icon className="h-5 w-5 text-[#b91c3a]" />
                                <h2 className="mt-3 text-sm font-semibold text-[#1b1230]">
                                    {item.title}
                                </h2>
                                <p className="mt-2 text-xs text-[#6b5d87]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur">
                        <h2 className="text-lg font-semibold text-[#1b1230]">
                            Retenção de dados
                        </h2>
                        <p className="mt-3 text-sm text-[#6b5d87]">
                            Guardamos registros necessários para auditoria e
                            segurança, seguindo princípios de minimização.
                        </p>
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur">
                        <h2 className="text-lg font-semibold text-[#1b1230]">
                            Contato e suporte
                        </h2>
                        <p className="mt-3 text-sm text-[#6b5d87]">
                            Em caso de dúvidas, utilize nossos canais oficiais
                            de atendimento disponíveis na página de contato.
                        </p>
                    </section>
                </main>
            </div>
        </>
    );
}
