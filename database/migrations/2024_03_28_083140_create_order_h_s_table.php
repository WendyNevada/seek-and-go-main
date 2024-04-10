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
        Schema::create('order_h_s', function (Blueprint $table) {
            $table->id('order_h_id');
            $table->bigInteger('agency_id')->unsigned();
            $table->foreign('agency_id')->references('agency_id')->on('agencies')->onDelete('cascade');
            $table->bigInteger('customer_id')->unsigned();
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->string('order_no', length:20);
            $table->dateTime('order_dt');
            $table->double('total_price', 17, 2);
            $table->string('order_status', length:20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_h_s');
    }
};
