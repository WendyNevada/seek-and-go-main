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
        Schema::create('ref_zipcodes', function (Blueprint $table) {
            $table->id('ref_zipcode_id');
            $table->string('zipcode');
            $table->string('area_1');
            $table->string('area_2');
            $table->string('area_3');
            $table->string('area_4');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ref_zipcodes');
    }
};
