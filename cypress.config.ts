import { defineConfig } from 'cypress';
import { execSync } from 'node:child_process';

export default defineConfig({
    e2e: {
        baseUrl: process.env.CYPRESS_BASE_URL ?? 'http://127.0.0.1:8000',
        supportFile: 'cypress/support/e2e.ts',
        specPattern: 'cypress/e2e/**/*.cy.ts',
        screenshotOnRunFailure: true,
        video: true,
        setupNodeEvents(on) {
            on('task', {
                'seed:e2e': () => {
                    execSync('php artisan db:seed --class=E2eSeeder', {
                        stdio: 'inherit',
                    });
                    return null;
                },
            });
        },
    },
    env: {
        E2E_USER_EMAIL: 'e2e-user@fintech.test',
        E2E_USER_PASSWORD: '12345678',
        E2E_TARGET_EMAIL: 'e2e-target@fintech.test',
        E2E_PIX_KEY: 'e2e-target@fintech.test',
    },
});
