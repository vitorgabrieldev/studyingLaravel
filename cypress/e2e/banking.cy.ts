describe('Fluxos bancários principais', () => {
    const email = Cypress.env('E2E_USER_EMAIL') as string;
    const password = Cypress.env('E2E_USER_PASSWORD') as string;
    const targetEmail = Cypress.env('E2E_TARGET_EMAIL') as string;
    const pixKey = Cypress.env('E2E_PIX_KEY') as string;

    before(() => {
        cy.task('seed:e2e');
    });

    beforeEach(() => {
        cy.login(email, password);
    });

    it('realiza Pix, transferência e boleto', () => {
        cy.visit('/pix');
        cy.contains('label', 'Chave Pix').find('input').type(pixKey);
        cy.contains('label', 'Valor').find('input').type('10,00');
        cy.contains('button', 'Confirmar Pix').click();
        cy.contains('Pix enviado com sucesso.').should('be.visible');

        cy.visit('/transferencias');
        cy.contains('label', 'Como deseja transferir?')
            .find('select')
            .select('Email do usuário');
        cy.contains('label', 'Email do destinatário')
            .find('input')
            .type(targetEmail);
        cy.contains('label', 'Valor').find('input').type('5,00');
        cy.contains('button', 'Confirmar transferência').click();
        cy.contains('Transferencia realizada.').should('be.visible');

        cy.visit('/boletos');
        cy.contains('label', 'Código de barras')
            .find('input')
            .type('34191790010104351004791020150008291070000010000');
        cy.contains('label', 'Beneficiário').find('input').type('Energy Co.');
        cy.contains('label', 'Valor').find('input').type('12,00');
        cy.contains('button', 'Pagar boleto').click();
        cy.contains('Boleto pago com sucesso.').should('be.visible');
    });

    it('cria cartão virtual e visualiza notificações', () => {
        cy.visit('/cartoes');
        cy.get('input#nickname').type('Streaming');
        cy.get('input#limit').type('120,00');
        cy.contains('button', 'Criar cartão').click();
        cy.contains('Cartão virtual').should('be.visible');

        cy.visit('/notificacoes');
        cy.contains('Notificações').should('be.visible');
        cy.contains('Cartão virtual criado').should('be.visible');
    });

    it('acessa extrato e comprovante', () => {
        cy.visit('/pix');
        cy.contains('label', 'Chave Pix').find('input').type(pixKey);
        cy.contains('label', 'Valor').find('input').type('3,00');
        cy.contains('button', 'Confirmar Pix').click();
        cy.contains('Pix enviado com sucesso.').should('be.visible');

        cy.visit('/transacoes');
        cy.contains('Últimas transações').should('be.visible');
        cy.contains('Ver comprovante').first().click();
        cy.contains('comprovante', { matchCase: false }).should('be.visible');
        cy.contains('Baixar PDF').should('have.attr', 'href');
    });
});
