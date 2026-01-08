const makeCpf = () =>
    Array.from({ length: 11 })
        .map(() => Cypress._.random(0, 9))
        .join('');

const makePhone = () =>
    `(11) 9${Cypress._.random(1000, 9999)}-${Cypress._.random(1000, 9999)}`;

describe('Cadastro', () => {
    it('cria uma nova conta e entra no dashboard', () => {
        const uniqueId = Date.now();
        const email = `e2e-${uniqueId}@fintech.test`;

        cy.visit('/register');
        cy.intercept('POST', '/register').as('registerRequest');

        cy.get('input[name="name"]').type(`Usuário E2E ${uniqueId}`);
        cy.get('input[name="cpf"]').type(makeCpf());
        cy.get('input[name="birth_date"]').type('1995-02-10');
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="phone"]').type(makePhone());

        cy.fillOtp('[data-test="password-otp"]', '12345678');
        cy.fillOtp('[data-test="confirm-password-otp"]', '12345678');

        cy.contains('button', 'Continuar').click();

        cy.get('input[name="address_line"]').type('Rua das Acacias');
        cy.get('input[name="address_number"]').type('120');
        cy.get('input[name="address_complement"]').type('Apto 31');
        cy.get('input[name="neighborhood"]').type('Centro');
        cy.get('input[name="city"]').type('Sao Paulo');
        cy.get('input[name="state"]').type('SP');
        cy.get('input[name="postal_code"]').type('01000-000');

        cy.get('[data-test="register-user-button"]').click();
        cy.wait('@registerRequest');

        cy.location('pathname', { timeout: 10000 }).then((pathname) => {
            if (pathname.includes('/dashboard')) {
                cy.contains('saldo atual', { matchCase: false }).should(
                    'be.visible',
                );
                cy.get('[data-test="sidebar-menu-button"]').click();
                cy.get('[data-test="logout-button"]').click();
                cy.url().should('include', '/login');
                return;
            }

            cy.contains('Verificar email', { matchCase: false }).should(
                'be.visible',
            );
            cy.contains('Sair').click();
            cy.url().should('include', '/login');
        });
    });
});
