<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RoleEnum: string
{
    use EnumToArray;
    case SUPER_ADMIN = 'SuperAdmin';
    case ADMIN = 'Admin';
    case VIEWER = 'Viewer';

    public function getPermissions(): array
    {
        return match ($this) {
            self::SUPER_ADMIN => PermissionEnum::allPermissions(),
            self::ADMIN => [
                // Equipment management
                PermissionEnum::EQUIPMENT_READ,
                PermissionEnum::EQUIPMENT_CREATE,
                PermissionEnum::EQUIPMENT_UPDATE,
                PermissionEnum::EQUIPMENT_DELETE,
                // User read access
                PermissionEnum::USER_READ,
            ],
            self::VIEWER => [
                // Equipment read only
                PermissionEnum::EQUIPMENT_READ,
            ],
        };
    }

    public function getDescription(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Full system access with all permissions',
            self::ADMIN => 'Manage equipment and borrowing states',
            self::VIEWER => 'View available equipment and borrow permissions',
        };
    }

    public static function getSelectOptions(): array
    {
        $options = [];
        foreach (self::cases() as $role) {
            $options[] = [
                'value' => $role->value,
                'label' => $role->value,
                'description' => $role->getDescription(),
            ];
        }

        return $options;
    }
}
