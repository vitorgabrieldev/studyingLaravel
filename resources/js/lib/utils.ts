import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatCurrency(valueCents: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valueCents / 100);
}

export function toCents(value: string) {
    const normalized = value.replace(',', '.');
    const parsed = Number.parseFloat(normalized);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.round(parsed * 100);
}

export function getCsrfToken() {
    if (typeof document === 'undefined') {
        return '';
    }

    const metaToken =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute(
            'content',
        ) ?? '';

    if (metaToken) {
        return metaToken;
    }

    const cookieMatch = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
}

export function getCsrfHeaders() {
    const token = getCsrfToken();

    if (!token) {
        return {};
    }

    return {
        'X-CSRF-TOKEN': token,
        'X-XSRF-TOKEN': token,
    };
}
