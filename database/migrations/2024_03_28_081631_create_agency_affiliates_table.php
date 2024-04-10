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
        Schema::create('agency_affiliates', function (Blueprint $table) {
            $table->id('agency_affiliate_id');
            $table->bigInteger('ref_hotel_id')->unsigned()->nullable();
            $table->foreign('ref_hotel_id')->references('ref_hotel_id')->on('ref_hotels')->onDelete('cascade');
            $table->bigInteger('ref_attraction_id')->unsigned()->nullable();
            $table->foreign('ref_attraction_id')->references('ref_attraction_id')->on('ref_attractions')->onDelete('cascade');
            $table->bigInteger('ref_vehicle_id')->unsigned()->nullable();
            $table->foreign('ref_vehicle_id')->references('ref_vehicle_id')->on('ref_vehicles')->onDelete('cascade');
            $table->bigInteger('agency_id')->unsigned();
            $table->foreign('agency_id')->references('agency_id')->on('agencies')->onDelete('cascade');
            $table->double('base_price', 17, 2);
            $table->string('promo_code', length:50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_affiliates');
    }
};
