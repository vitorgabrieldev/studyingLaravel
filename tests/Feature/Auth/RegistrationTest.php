<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'cpf' => '12345678901',
            'phone' => '11999999999',
            'birth_date' => '1995-05-10',
            'address_line' => 'Rua Exemplo',
            'address_number' => '123',
            'address_complement' => 'Apto 45',
            'neighborhood' => 'Centro',
            'city' => 'Sao Paulo',
            'state' => 'SP',
            'postal_code' => '01000-000',
            'password' => '12345678',
            'password_confirmation' => '12345678',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}
