<?php

namespace Database\Seeders;

use App\Models\RefAttraction;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RefAttractionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RefAttraction::factory()
        ->count(10)
        ->create();
    }
}
