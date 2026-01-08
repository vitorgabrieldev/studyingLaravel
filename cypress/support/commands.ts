Cypress.Commands.add('fillOtp', (selector: string, value: string) => {
    const digits = value.split('');

    cy.get(selector)
        .find('input')
        .should('have.length.at.least', digits.length)
        .each((input, index) => {
            const digit = digits[index];
            if (!digit) {
                return;
            }
            cy.wrap(input).clear().type(digit, { force: true });
        });
});

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.session([email, password], () => {
        cy.task('seed:e2e');
        cy.visit('/login');
        cy.intercept('POST', '/login').as('loginRequest');
        cy.get('input[name="email"]').clear().type(email);
        cy.fillOtp('[data-test="password-otp"]', password);
        cy.get('[data-test="login-button"]').click();
        cy.wait('@loginRequest');
        cy.location('pathname', { timeout: 10000 }).then((pathname) => {
            if (pathname.includes('/email/verify')) {
                throw new Error(
                    'Usuario E2E nao verificado. Confirme o email no seed.',
                );
            }
            expect(pathname).to.include('/dashboard');
        });
    });

    cy.visit('/dashboard');
});
