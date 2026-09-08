<?php

namespace App\Domain\Order\Exceptions;

use Exception;

class InvalidOrderStatusTransitionException extends Exception
{
    public function __construct(string $fromStatus, string $toStatus)
    {
        parent::__construct("Transisi status order tidak valid dari '{$fromStatus}' ke '{$toStatus}'.");
    }
}
