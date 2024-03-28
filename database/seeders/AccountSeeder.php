<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Account::factory()
        ->count(5)
        ->hasCustomers(1)
        ->create();

        // Account::factory()
        // ->count(5)
        // ->hasAgencies(1)
        // ->create();

    }
}
