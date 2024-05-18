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
        Schema::create('promo_histories', function (Blueprint $table) {
            $table->id('promo_history_id');
            $table->bigInteger('customer_id')->unsigned();
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->bigInteger('promo_id')->unsigned();
            $table->foreign('promo_id')->references('promo_id')->on('promos')->onDelete('cascade');
            $table->integer('counter');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promo_histories');
    }
};
