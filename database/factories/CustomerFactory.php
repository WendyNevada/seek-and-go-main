<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $customerAccounts = Account::where('role', 'Customer')->get();

        return [
            'account_id' => $customerAccounts->random()->account_id,
            'customer_name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['M', 'F']),
            'birth_date' => $this->faker->date()
        ];
    }
}
