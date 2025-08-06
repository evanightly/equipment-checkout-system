<?php

namespace App\Enums;

enum BorrowingStatusEnum: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case BORROWED = 'borrowed';
    case RETURNED = 'returned';
    case OVERDUE = 'overdue';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::APPROVED => 'Approved',
            self::BORROWED => 'Borrowed',
            self::RETURNED => 'Returned',
            self::OVERDUE => 'Overdue',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function badgeVariant(): string
    {
        return match ($this) {
            self::PENDING => 'pending',
            self::APPROVED => 'approved',
            self::BORROWED => 'approved',
            self::RETURNED => 'returned',
            self::OVERDUE => 'overdue',
            self::CANCELLED => 'rejected', // Keep 'rejected' variant for UI styling
        };
    }
}
