<?php

namespace App\Domain\Order\Enums;

enum OrderStatus: string
{
    case PENDING_PAYMENT = 'pending_payment';
    case CONFIRMED = 'confirmed';
    case PROCESSING = 'processing';
    case PACKED = 'packed';
    case SHIPPED = 'shipped';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case REFUNDED = 'refunded';

    /**
     * Get allowed next statuses from current status.
     *
     * @return array<string>
     */
    public function allowedNextStatuses(): array
    {
        return match ($this) {
            self::PENDING_PAYMENT => [self::CONFIRMED->value, self::CANCELLED->value],
            self::CONFIRMED => [self::PROCESSING->value, self::CANCELLED->value, self::REFUNDED->value],
            self::PROCESSING => [self::PACKED->value, self::CANCELLED->value, self::REFUNDED->value],
            self::PACKED => [self::SHIPPED->value, self::CANCELLED->value, self::REFUNDED->value],
            self::SHIPPED => [self::COMPLETED->value, self::REFUNDED->value],
            self::COMPLETED => [self::REFUNDED->value],
            self::CANCELLED, self::REFUNDED => [],
        };
    }

    public function canTransitionTo(string|self $target): bool
    {
        $targetValue = $target instanceof self ? $target->value : $target;

        if ($targetValue === $this->value) {
            return true;
        }

        return in_array($targetValue, $this->allowedNextStatuses(), true);
    }
}
