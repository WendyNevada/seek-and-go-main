<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $role = $this->faker->randomElement(['Agency']);

        return [
            'account_name' => $this->faker->userName(),
            'email' => $this->faker->email(),
            'password' => $this->faker->password(),
            'role' => $role,
            'phone' => $this->faker->phoneNumber()
        ];
    }
}
