import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Aparência',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aparência" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Aparência"
                        description="O sistema usa apenas o modo claro."
                    />
                    <div className="rounded-2xl border border-white/70 bg-white/80 p-5 text-sm text-muted-foreground">
                        O modo escuro foi removido para manter a identidade
                        visual mais clara.
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
