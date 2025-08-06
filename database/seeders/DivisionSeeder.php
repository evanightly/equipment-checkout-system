<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            [
                'name' => 'News Division',
                'code' => 'NEWS',
                'description' => 'News and current affairs production',
                'is_active' => true,
            ],
            [
                'name' => 'Sports Division',
                'code' => 'SPORTS',
                'description' => 'Sports broadcasting and production',
                'is_active' => true,
            ],
            [
                'name' => 'Entertainment Division',
                'code' => 'ENT',
                'description' => 'Entertainment programming and variety shows',
                'is_active' => true,
            ],
            [
                'name' => 'Technical Division',
                'code' => 'TECH',
                'description' => 'Technical operations and maintenance',
                'is_active' => true,
            ],
            [
                'name' => 'Production Division',
                'code' => 'PROD',
                'description' => 'General production and post-production',
                'is_active' => true,
            ],
        ];

        foreach ($divisions as $division) {
            Division::create($division);
        }
    }
}
