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
        Schema::create('package_history_d_s', function (Blueprint $table) {
            $table->id('package_history_d_id');
            $table->bigInteger('package_history_h_id')->unsigned();
            $table->foreign('package_history_h_id')->references('package_history_h_id')->on('package_history_h_s')->onDelete('cascade');
            $table->string('hotel_name', length:100);
            $table->dateTime('hotel_start_dt');
            $table->dateTime('hotel_end_dt');
            $table->string('attraction_name', length:100);
            $table->dateTime('attraction_start_dt');
            $table->dateTime('attraction_end_dt');
            $table->string('vehicle_name', length:100);
            $table->dateTime('vehicle_start_dt');
            $table->dateTime('vehicle_end_dt');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_history_d_s');
    }
};
