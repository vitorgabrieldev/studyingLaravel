<?php

namespace App\Exceptions;

use RuntimeException;

class SelfTransferException extends RuntimeException
{
    public function __construct(string $message = 'Voce nao pode transferir para a propria conta.')
    {
        parent::__construct($message);
    }
}
