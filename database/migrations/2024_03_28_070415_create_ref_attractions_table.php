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
        Schema::create('ref_attractions', function (Blueprint $table) {
            $table->id('ref_attraction_id');
            $table->string('attraction_code', length:50);
            $table->unique('attraction_code');
            $table->bigInteger('ref_zipcode_id')->unsigned();
            $table->foreign('ref_zipcode_id')->references('ref_zipcode_id')->on('ref_zipcodes')->onDelete('cascade');
            $table->string('attraction_name', length:100);
            $table->string('description', length:1000);
            $table->string('address', length:100);
            $table->float('rating', 3, 1);
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
        Schema::dropIfExists('ref_attractions');
    }
};
