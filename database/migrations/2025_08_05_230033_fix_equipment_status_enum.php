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
        // Only fix the status enum - all other columns already exist
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('equipment', function (Blueprint $table) {
            $table->enum('status', ['available', 'borrowed', 'maintenance', 'damaged', 'retired'])->default('available');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('equipment', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('equipment', function (Blueprint $table) {
            $table->enum('status', ['Tersedia', 'Dipinjam', 'Perlu Servis', 'Rusak'])->default('Tersedia');
        });
    }
};
