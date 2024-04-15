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
        Schema::create('order_d_s', function (Blueprint $table) {
            $table->id('order_d_id');
            $table->bigInteger('order_h_id')->unsigned();
            $table->foreign('order_h_id')->references('order_h_id')->on('order_h_s')->onDelete('cascade');
            $table->bigInteger('package_h_id')->unsigned()->nullable();
            $table->foreign('package_h_id')->references('package_h_id')->on('package_h_s')->onDelete('cascade');
            $table->bigInteger('package_history_id')->unsigned()->nullable();
            $table->bigInteger('ref_hotel_id')->unsigned()->nullable();
            $table->foreign('ref_hotel_id')->references('ref_hotel_id')->on('ref_hotels')->onDelete('cascade');
            $table->bigInteger('ref_attraction_id')->unsigned()->nullable();
            $table->foreign('ref_attraction_id')->references('ref_attraction_id')->on('ref_attractions')->onDelete('cascade');
            $table->bigInteger('ref_vehicle_id')->unsigned()->nullable();
            $table->foreign('ref_vehicle_id')->references('ref_vehicle_id')->on('ref_vehicles')->onDelete('cascade');
            $table->dateTime('start_dt');
            $table->dateTime('end_dt');
            $table->double('price', 17, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_d_s');
    }
};
