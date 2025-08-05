<?php

namespace Database\Seeders;

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
        User::factory(100)->create();

        // Create test users with both email and NIP (18 digits)
        User::factory()->create([
            'name' => 'Test User',
            'nip' => '123456789012345678',
            'email' => 'test@example.com',
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'nip' => '000000000000000001',
            'email' => 'admin@example.com',
        ]);

        User::factory()->create([
            'name' => 'Technician User',
            'nip' => '999999999999999999',
            'email' => 'tech@example.com',
        ]);
    }
}
