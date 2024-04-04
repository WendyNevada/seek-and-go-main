<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RefAttraction>
 */
class RefAttractionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attraction_code' => $this->faker->ean8(),
            'ref_zipcode_id' => $this->faker->numberBetween(1, 81711),
            'attraction_name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'address' => $this->faker->address(),
            'rating' => $this->faker->randomFloat(1, 1.0, 5.0),
            'is_active' => $this->faker->boolean(),
            'qty' => $this->faker->numberBetween(1, 10),
            'promo_code' => $this->faker->word()
        ];
    }
}
