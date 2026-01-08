declare namespace Cypress {
    interface Chainable {
        fillOtp(selector: string, value: string): Chainable<void>;
        login(email: string, password: string): Chainable<void>;
    }
}
