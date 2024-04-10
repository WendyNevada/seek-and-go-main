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
        Schema::create('ref_vehicles', function (Blueprint $table) {
            $table->id('ref_vehicle_id');
            $table->string('vehicle_code', length:50);
            $table->unique('vehicle_code');
            $table->bigInteger('ref_zipcode_id')->unsigned();
            $table->foreign('ref_zipcode_id')->references('ref_zipcode_id')->on('ref_zipcodes')->onDelete('cascade');
            $table->string('vehicle_type', length:100);
            $table->string('vehicle_brand', length:100);
            $table->string('vehicle_series', length:100);
            $table->string('vehicle_model', length:100);
            $table->string('vehicle_year', length:5);
            $table->string('vehicle_name', length:100);
            $table->string('description', length:1000);
            $table->boolean('with_driver');
            $table->string('address', length:100);
            $table->float('rating', 3, 1)->nullable();
            $table->boolean('is_active');
            $table->integer('qty');
            $table->string('promo_code', length:50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ref_vehicles');
    }
};
