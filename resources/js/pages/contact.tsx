import AppLogo from '@/components/app-logo';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Mail, Phone, SendHorizonal } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 2500);
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <>
            <Head title="Contato" />
            <div className="relative min-h-screen overflow-hidden bg-[#fdf7f3] text-[#230f2b]">
                <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,29,65,0.25),rgba(242,29,65,0))] blur-3xl" />
                <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(35,15,43,0.2),rgba(35,15,43,0))] blur-3xl" />

                <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <AppLogo />
                    </Link>
                    <nav className="flex items-center gap-4 text-sm text-[#4b3b70]">
                        <Link href="/sobre" className="hover:text-[#230f2b]">
                            Sobre
                        </Link>
                        <Link href="/faq" className="hover:text-[#230f2b]">
                            FAQ
                        </Link>
                        <Link href="/politicas" className="hover:text-[#230f2b]">
                            Políticas
                        </Link>
                    </nav>
                </header>

                <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-8">
                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Contato
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold">
                            Fale com o time Fintech.laravel
                        </h1>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Estamos prontos para ajudar você com dúvidas sobre
                            conta digital, cartões e serviços.
                        </p>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {[
                            {
                                title: 'Ouvidoria',
                                description: '0800 123 4567',
                                icon: Phone,
                            },
                            {
                                title: 'Email',
                                description: 'atendimento@fintech.laravel',
                                icon: Mail,
                            },
                            {
                                title: 'Site',
                                description: 'www.fintech.laravel',
                                icon: SendHorizonal,
                            },
                            {
                                title: 'Horário',
                                description: 'Seg a Sex · 8h às 18h',
                                icon: CheckCircle2,
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur"
                            >
                                <item.icon className="h-4 w-4 text-[#b91c3a]" />
                                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    {item.title}
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-sm backdrop-blur">
                        <h2 className="text-lg font-semibold">
                            Envie sua mensagem
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Este formulário é demonstrativo, mas a experiência
                            simula um atendimento real.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 grid gap-4"
                        >
                            <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                                Nome
                                <input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                                Email
                                <input
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    className="h-11 rounded-xl border border-white/80 bg-white/70 px-3"
                                    placeholder="email@exemplo.com"
                                    type="email"
                                    required
                                />
                            </label>
                            <label className="grid gap-2 text-sm font-medium text-[#3c2b5b]">
                                Mensagem
                                <textarea
                                    value={message}
                                    onChange={(event) =>
                                        setMessage(event.target.value)
                                    }
                                    className="min-h-[120px] rounded-xl border border-white/80 bg-white/70 px-3 py-2"
                                    placeholder="Conte sua dúvida ou sugestão"
                                    required
                                />
                            </label>
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:bg-primary/90 active:scale-95"
                            >
                                <SendHorizonal className="h-4 w-4" />
                                Enviar mensagem
                            </button>
                            {sent && (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Mensagem enviada com sucesso! Em breve
                                    entraremos em contato.
                                </div>
                            )}
                        </form>
                    </section>
                </main>
            </div>
        </>
    );
}
