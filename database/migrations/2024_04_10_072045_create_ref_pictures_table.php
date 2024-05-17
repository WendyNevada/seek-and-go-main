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
        Schema::create('ref_pictures', function (Blueprint $table) {
            $table->id('ref_picture_id');
            $table->bigInteger('ref_hotel_id')->unsigned()->nullable();
            $table->foreign('ref_hotel_id')->references('ref_hotel_id')->on('ref_hotels')->onDelete('cascade');
            $table->bigInteger('ref_attraction_id')->unsigned()->nullable();
            $table->foreign('ref_attraction_id')->references('ref_attraction_id')->on('ref_attractions')->onDelete('cascade');
            $table->bigInteger('ref_vehicle_id')->unsigned()->nullable();
            $table->foreign('ref_vehicle_id')->references('ref_vehicle_id')->on('ref_vehicles')->onDelete('cascade');
            $table->bigInteger('order_h_id')->unsigned()->nullable();
            $table->foreign('order_h_id')->references('order_h_id')->on('order_h_s')->onDelete('cascade');
            $table->bigInteger('agency_payment_id')->unsigned()->nullable();
            $table->foreign('agency_payment_id')->references('agency_payment_id')->on('agency_payments')->onDelete('cascade');
            $table->string('image_url', length:2000);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ref_pictures');
    }
};
