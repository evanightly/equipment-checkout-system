<?php

namespace App\Models;

use App\Enums\EquipmentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    protected $fillable = [
        'name',
        'code',
        'type',
        'description',
        'brand',
        'model',
        'serial_number',
        'status',
        'purchase_price',
        'purchase_date',
        'warranty_expires_at',
        'division_id',
        'image_path',
        'notes',
        'location',
        'is_active',
        'is_available_for_borrowing',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'purchase_date' => 'date',
        'warranty_expires_at' => 'date',
        'is_active' => 'boolean',
        'is_available_for_borrowing' => 'boolean',
    ];

    /**
     * Get the division that owns this equipment
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Get all borrowing records for this equipment
     */
    public function borrowingHistory(): HasMany
    {
        return $this->hasMany(EquipmentUser::class);
    }

    /**
     * Get current borrowing record (if equipment is borrowed)
     */
    public function currentBorrowing(): HasMany
    {
        return $this->hasMany(EquipmentUser::class)->where('status', 'borrowed');
    }

    /**
     * Get the user who is currently borrowing this equipment
     */
    public function currentBorrower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_borrower_id');
    }

    /**
     * Get users who have borrowed this equipment
     */
    public function borrowers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'equipment_users')
            ->withPivot([
                'borrowed_at',
                'due_date',
                'returned_at',
                'purpose',
                'notes',
                'status',
                'return_condition',
                'admin_notes',
            ])
            ->withTimestamps();
    }

    /**
     * Check if equipment is currently borrowed
     */
    public function isBorrowed(): bool
    {
        return $this->status === EquipmentStatusEnum::BORROWED->value && $this->currentBorrowing()->exists();
    }

    /**
     * Check if equipment is available for borrowing
     */
    public function isAvailable(): bool
    {
        return $this->status === EquipmentStatusEnum::AVAILABLE->value && $this->is_active;
    }

    /**
     * Check if equipment is currently borrowed (alias for isBorrowed)
     */
    public function isCurrentlyBorrowed(): bool
    {
        return $this->isBorrowed();
    }

    /**
     * Get equipment status badge color
     */
    public function getStatusBadgeColor(): string
    {
        return match ($this->status) {
            EquipmentStatusEnum::AVAILABLE->value => 'success',
            EquipmentStatusEnum::BORROWED->value => 'warning',
            EquipmentStatusEnum::MAINTENANCE->value => 'secondary',
            EquipmentStatusEnum::DAMAGED->value => 'destructive',
            EquipmentStatusEnum::RETIRED->value => 'secondary',
            default => 'secondary',
        };
    }
}
