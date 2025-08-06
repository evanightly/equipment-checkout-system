<?php

namespace App\Enums;

enum EquipmentStatusEnum: string
{
    case AVAILABLE = 'available';
    case BORROWED = 'borrowed';
    case MAINTENANCE = 'maintenance';
    case DAMAGED = 'damaged';
    case RETIRED = 'retired';

    public function label(): string
    {
        return match ($this) {
            self::AVAILABLE => 'Available',
            self::BORROWED => 'Borrowed',
            self::MAINTENANCE => 'Under Maintenance',
            self::DAMAGED => 'Damaged',
            self::RETIRED => 'Retired',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::AVAILABLE => 'green',
            self::BORROWED => 'blue',
            self::MAINTENANCE => 'yellow',
            self::DAMAGED => 'red',
            self::RETIRED => 'gray',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::AVAILABLE => 'check-circle',
            self::BORROWED => 'user-check',
            self::MAINTENANCE => 'wrench',
            self::DAMAGED => 'alert-triangle',
            self::RETIRED => 'archive',
        };
    }

    public static function getAvailableForBorrowing(): array
    {
        return [self::AVAILABLE];
    }

    public static function getUnavailableStatuses(): array
    {
        return [self::BORROWED, self::MAINTENANCE, self::DAMAGED, self::RETIRED];
    }
}
