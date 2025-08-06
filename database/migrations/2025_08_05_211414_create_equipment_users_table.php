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
        Schema::create('equipment_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipment')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users'); // Admin who approved
            $table->datetime('borrowed_at')->default(now());
            $table->datetime('due_date');
            $table->datetime('returned_at')->nullable();
            $table->foreignId('returned_to')->nullable()->constrained('users'); // Admin who received return
            $table->text('purpose'); // Purpose of borrowing
            $table->text('notes')->nullable(); // Additional notes
            $table->enum('status', ['pending', 'approved', 'borrowed', 'returned', 'overdue', 'cancelled'])->default('pending');
            $table->text('return_condition')->nullable(); // Condition when returned
            $table->text('admin_notes')->nullable(); // Notes from admin
            $table->timestamps();

            // Indexes for better performance
            $table->index(['equipment_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['borrowed_at', 'due_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_users');
    }
};
