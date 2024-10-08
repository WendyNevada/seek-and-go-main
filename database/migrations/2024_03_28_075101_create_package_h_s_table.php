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
        Schema::create('package_h_s', function (Blueprint $table) {
            $table->id('package_h_id');
            $table->string('package_code', length:50);
            $table->unique('package_code');
            $table->bigInteger('agency_id')->unsigned();
            $table->foreign('agency_id')->references('agency_id')->on('agencies')->onDelete('cascade');
            $table->bigInteger('customer_id')->unsigned()->nullable();
            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');
            $table->string('package_name', length:100);
            $table->string('description', length:1000);
            $table->boolean('is_custom');
            $table->string('custom_status', length:20)->nullable();
            $table->double('package_price', 17, 2)->nullable();
            $table->boolean('is_active');
            $table->integer('qty');
            $table->integer('total_days')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_h_s');
    }
};
