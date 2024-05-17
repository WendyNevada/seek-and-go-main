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
        Schema::create('agency_payments', function (Blueprint $table) {
            $table->id('agency_payment_id');
            $table->bigInteger('agency_id')->unsigned();
            $table->foreign('agency_id')->references('agency_id')->on('agencies')->onDelete('cascade');
            $table->string('payment_type', length:50);
            $table->string('bank_name', length:100);
            $table->string('account_no', length:100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_payments');
    }
};
