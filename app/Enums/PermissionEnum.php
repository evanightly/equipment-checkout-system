<?php

namespace App\Enums;

enum PermissionEnum: string
{
    // Equipment permissions
    case EQUIPMENT_READ = 'Equipment::Read';
    case EQUIPMENT_CREATE = 'Equipment::Create';
    case EQUIPMENT_UPDATE = 'Equipment::Update';
    case EQUIPMENT_DELETE = 'Equipment::Delete';

    // Division permissions
    case DIVISION_READ = 'Division::Read';
    case DIVISION_CREATE = 'Division::Create';
    case DIVISION_UPDATE = 'Division::Update';
    case DIVISION_DELETE = 'Division::Delete';

    // User permissions
    case USER_READ = 'User::Read';
    case USER_CREATE = 'User::Create';
    case USER_UPDATE = 'User::Update';
    case USER_DELETE = 'User::Delete';

    // Permission permissions
    case PERMISSION_READ = 'Permission::Read';
    case PERMISSION_CREATE = 'Permission::Create';
    case PERMISSION_UPDATE = 'Permission::Update';
    case PERMISSION_DELETE = 'Permission::Delete';

    // Role permissions
    case ROLE_READ = 'Role::Read';
    case ROLE_CREATE = 'Role::Create';
    case ROLE_UPDATE = 'Role::Update';
    case ROLE_DELETE = 'Role::Delete';

    public static function equipmentPermissions(): array
    {
        return [
            self::EQUIPMENT_READ,
            self::EQUIPMENT_CREATE,
            self::EQUIPMENT_UPDATE,
            self::EQUIPMENT_DELETE,
        ];
    }

    public static function divisionPermissions(): array
    {
        return [
            self::DIVISION_READ,
            self::DIVISION_CREATE,
            self::DIVISION_UPDATE,
            self::DIVISION_DELETE,
        ];
    }

    public static function userPermissions(): array
    {
        return [
            self::USER_READ,
            self::USER_CREATE,
            self::USER_UPDATE,
            self::USER_DELETE,
        ];
    }

    public static function permissionPermissions(): array
    {
        return [
            self::PERMISSION_READ,
            self::PERMISSION_CREATE,
            self::PERMISSION_UPDATE,
            self::PERMISSION_DELETE,
        ];
    }

    public static function rolePermissions(): array
    {
        return [
            self::ROLE_READ,
            self::ROLE_CREATE,
            self::ROLE_UPDATE,
            self::ROLE_DELETE,
        ];
    }

    public static function allPermissions(): array
    {
        return array_merge(
            self::equipmentPermissions(),
            self::divisionPermissions(),
            self::userPermissions(),
            self::permissionPermissions(),
            self::rolePermissions()
        );
    }

    public function getCategory(): string
    {
        return explode('::', $this->value)[0];
    }

    public function getAction(): string
    {
        return explode('::', $this->value)[1];
    }
}
