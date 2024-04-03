<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promo>
 */
class PromoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $is_amount = $this->faker->boolean();
        $amount = $is_amount == true ? $this->faker->randomFloat() : 0;
        $percent = $is_amount == false ? $this->faker->randomFloat() : 0;

        return [
            'promo_code' => $this->faker->word(),
            'start_date' => $this->faker->dateTime(),
            'end_date' => $this->faker->dateTime(),
            'is_hotel' => $this->faker->boolean(),
            'is_vehicle' => $this->faker->boolean(),
            'is_attraction' => $this->faker->boolean(),
            'is_amount' => $is_amount,
            'amount' => $amount,
            'percent' => $percent,
        ];
    }
}
