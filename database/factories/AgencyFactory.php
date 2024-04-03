<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Agency>
 */
class AgencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $agencyAccounts = Account::where('role', 'Agency')->get();
        return [
            'account_id' => $agencyAccounts->random()->account_id,
            'agency_name' => $this->faker->company(),
            'npwp' => $this->faker->numerify('################'),
            'location' => $this->faker->address()
        ];
    }
}
