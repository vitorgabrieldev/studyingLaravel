<?php

namespace App\Exceptions;

use RuntimeException;

class InsufficientFundsException extends RuntimeException
{
    public function __construct(string $message = 'Saldo insuficiente para esta operacao.')
    {
        parent::__construct($message);
    }
}
