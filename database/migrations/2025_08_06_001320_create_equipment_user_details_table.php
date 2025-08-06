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
        Schema::create('equipment_user_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_user_id')
                ->constrained('equipment_users')
                ->onDelete('cascade');
            $table->foreignId('equipment_id')
                ->constrained('equipment')
                ->onDelete('cascade');
            $table->timestamps();

            // Prevent duplicate equipment in the same borrowing request
            $table->unique(['equipment_user_id', 'equipment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_user_details');
    }
};
