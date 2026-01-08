# Fintech Laravel - Technical Documentation

## Overview
Digital banking simulation built with Laravel and Inertia + React. The application focuses on secure onboarding, consistent financial operations, and a responsive web experience.

## Application responsibilities
- Account onboarding with personal and address data
- Current account provisioning and card issuance
- Transaction ledger for debits and credits
- Pix transfers and boleto payments
- Financial notifications and PDF receipts

## Stack
- Backend: Laravel 12, PHP 8.3, Fortify (auth and 2FA), Wayfinder (typed routes), DomPDF (receipts)
- Frontend: Inertia v2, React 19, TypeScript, Tailwind v4, Vite
- UI/UX: Radix UI, lucide-react, shared UI components
- Data: MySQL (primary), SQLite (local/tests), Eloquent ORM
- Tooling: PHPUnit, Pint, ESLint, Prettier

## Architecture and structure
- `app/Services/Banking`: domain services for transfers, Pix, boletos, cards, receipts
- `app/Http/Controllers`: web and API controllers by context
- `resources/js/pages`: Inertia pages (dashboard, auth, transactions, Pix)
- `resources/js/components`: design system and reusable UI blocks
- `routes/web.php` and `routes/api.php`: typed routes via Wayfinder
- `resources/views`: Inertia root view and receipt templates

## Core data model
- `users`: identity, address, and authentication profile
- `accounts`: current account identifiers and balance
- `cards`: physical/virtual cards with encrypted PAN/CVV
- `transactions`: debit/credit ledger
- `transfers`: account-to-account movements
- `pix_keys`: Pix keys tied to accounts
- `boleto_payments`: boleto payments
- `notifications`: financial events feed

## Key flows
- Two-step registration (personal data + address)
- Account creation and physical card provisioning on first access
- Dashboard summary with balance, card snapshot, and recent activity
- Pix send by key with validation and notifications
- Transfers with pessimistic locking and atomic transactions
- Boleto payments with receipt generation

## Technical decisions
- Monolith with Inertia to keep backend authority and frontend responsiveness
- Service layer to isolate business rules and side effects
- Financial consistency enforced with `DB::transaction()` and `lockForUpdate()`
- Sensitive data protection with encrypted casts for PAN/CVV
- Typed routes via Wayfinder to prevent route mismatches
- Numeric 8-digit PIN for authentication UX alignment

## Security
- Fortify for auth, password reset, 2FA, and email verification
- Password hashing handled by Laravel
- Encrypted storage for sensitive card data
- `auth` and `verified` middleware on protected routes

## Observability and maintenance
- Central logs in `storage/logs/laravel.log`
- Pail for real-time log streaming
- Versioned migrations for schema evolution

## Testing
- PHPUnit feature tests for critical auth and protected routes

## Local setup
1) `composer install`
2) `cp .env.example .env` and configure the database
3) `php artisan key:generate`
4) `php artisan migrate`
5) `npm install`
6) `npm run dev` (or `composer run dev`)

## Useful scripts
- `composer run dev`: server, queue, logs, and Vite
- `npm run build`: frontend build
- `php artisan test --compact`: tests

## Roadmap
- Real-time dashboard data
- Full virtual card lifecycle
- Exportable reports (CSV)
- Feature flags for experiments
