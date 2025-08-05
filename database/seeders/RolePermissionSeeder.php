<?php

namespace Database\Seeders;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = collect(PermissionEnum::cases())->map(function ($permission) {
            return Permission::firstOrCreate([
                'name' => $permission->value,
                'guard_name' => 'web',
            ]);
        });

        // Create roles and assign permissions
        foreach (RoleEnum::cases() as $roleEnum) {
            $role = Role::firstOrCreate([
                'name' => $roleEnum->value,
                'guard_name' => 'web',
            ]);

            // Get permissions for this role
            $rolePermissions = collect($roleEnum->getPermissions())
                ->map(fn ($perm) => $perm->value)
                ->toArray();

            // Sync permissions to role
            $role->syncPermissions($rolePermissions);

            $this->command->info("Created role: {$roleEnum->value} with ".count($rolePermissions).' permissions');
        }

        $this->command->info('Roles and permissions created successfully!');
    }
}
