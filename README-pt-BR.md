# Fintech Laravel - Documentação Técnica

## Visão geral
Simulação de banco digital construída com Laravel e Inertia + React. A aplicação foca em onboarding seguro, operações financeiras consistentes e experiência web responsiva.

## Responsabilidades da aplicação
- Onboarding com dados pessoais e endereço
- Provisionamento de conta corrente e emissão de cartão
- Ledger de transações com débitos e créditos
- Transferências via Pix e pagamento de boletos
- Notificações financeiras e comprovantes em PDF

## Stack
- Backend: Laravel 12, PHP 8.3, Fortify (auth e 2FA), Wayfinder (rotas tipadas), DomPDF (comprovantes)
- Frontend: Inertia v2, React 19, TypeScript, Tailwind v4, Vite
- UI/UX: Radix UI, lucide-react, componentes compartilhados
- Dados: MySQL (principal), SQLite (local/testes), Eloquent ORM
- Tooling: PHPUnit, Pint, ESLint, Prettier

## Arquitetura e organização
- `app/Services/Banking`: serviços de domínio para transferências, Pix, boletos, cartões, comprovantes
- `app/Http/Controllers`: controllers web e API por contexto
- `resources/js/pages`: páginas Inertia (dashboard, auth, transações, Pix)
- `resources/js/components`: design system e blocos reutilizáveis
- `routes/web.php` e `routes/api.php`: rotas tipadas via Wayfinder
- `resources/views`: view raiz do Inertia e templates de comprovantes

## Modelo de dados principal
- `users`: identidade, endereço e perfil de autenticação
- `accounts`: identificadores da conta corrente e saldo
- `cards`: cartões físico/virtual com PAN/CVV criptografados
- `transactions`: ledger de débitos e créditos
- `transfers`: movimentações entre contas
- `pix_keys`: chaves Pix vinculadas às contas
- `boleto_payments`: pagamentos de boletos
- `notifications`: feed de eventos financeiros

## Fluxos principais
- Registro em duas etapas (dados pessoais + endereço)
- Criação de conta e cartão físico no primeiro acesso
- Dashboard com saldo, snapshot do cartão e últimas movimentações
- Envio Pix por chave com validação e notificações
- Transferências com lock pessimista e transações atômicas
- Pagamento de boletos com geração de comprovante

## Decisões técnicas
- Monólito com Inertia para manter autoridade no backend e fluidez no frontend
- Camada de serviços para isolar regras de negócio e efeitos colaterais
- Consistência financeira com `DB::transaction()` e `lockForUpdate()`
- Proteção de dados sensíveis com casts criptografados para PAN/CVV
- Rotas tipadas via Wayfinder para evitar inconsistências
- PIN numérico de 8 dígitos para alinhamento com UX de autenticação

## Segurança
- Fortify para auth, reset de senha, 2FA e verificação de email
- Hash de senhas gerenciado pelo Laravel
- Armazenamento criptografado para dados de cartão
- Middlewares `auth` e `verified` em rotas protegidas

## Observabilidade e manutenção
- Logs centralizados em `storage/logs/laravel.log`
- Pail para streaming de logs
- Migrations versionadas para evolução do schema

## Testes
- PHPUnit com foco nos fluxos críticos de auth e rotas protegidas

## Como rodar localmente
1) `composer install`
2) `cp .env.example .env` e configure o banco
3) `php artisan key:generate`
4) `php artisan migrate`
5) `npm install`
6) `npm run dev` (ou `composer run dev`)

## Scripts úteis
- `composer run dev`: servidor, fila, logs e Vite
- `npm run build`: build do frontend
- `php artisan test --compact`: testes

## Roadmap
- Dashboard com dados em tempo real
- Ciclo completo de cartão virtual
- Relatórios exportáveis (CSV)
- Feature flags para experimentos
