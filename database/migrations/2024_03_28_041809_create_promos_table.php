<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id('promo_id');
            $table->string('promo_code', length:50);
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->boolean('is_hotel');
            $table->boolean('is_vehicle');
            $table->boolean('is_attraction');
            $table->boolean('is_amount');
            $table->double('amount', 17, 2);
            $table->double('percent', 17, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
