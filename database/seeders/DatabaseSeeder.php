<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, create roles and permissions
        $this->call(RolePermissionSeeder::class);

        User::factory(100)->create();

        // Create test users with both email and NIP (18 digits)
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'nip' => '123456789012345678',
            'email' => 'test@example.com',
        ]);
        $testUser->assignRole(RoleEnum::VIEWER);

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'nip' => '000000000000000001',
            'email' => 'admin@example.com',
        ]);
        $adminUser->assignRole(RoleEnum::ADMIN);

        $superAdminUser = User::factory()->create([
            'name' => 'SuperAdmin User',
            'nip' => '999999999999999999',
            'email' => 'superadmin@example.com',
        ]);
        $superAdminUser->assignRole(RoleEnum::SUPER_ADMIN);
    }
}
