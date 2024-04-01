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
        Schema::create('trxes', function (Blueprint $table) {
            $table->id('trx_id');
            $table->string('trx_no', length:20);
            $table->bigInteger('order_h_id')->unsigned();
            $table->foreign('order_h_id')->references('order_h_id')->on('order_hs')->onDelete('cascade');
            $table->boolean('payment_status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trxes');
    }
};
