<?php

namespace App\Models;

use App\Enums\EquipmentStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'current_borrower_id',
        'borrowed_at',
        'current_due_date',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'purchase_date' => 'date',
        'warranty_expires_at' => 'date',
        'borrowed_at' => 'datetime',
        'current_due_date' => 'datetime',
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
     * Get all borrowing records for this equipment through details
     */
    public function borrowingHistory()
    {
        return $this->belongsToMany(EquipmentUser::class, 'equipment_user_details')
            ->withTimestamps();
    }

    /**
     * Get current borrowing record (if equipment is borrowed)
     */
    public function currentBorrowing()
    {
        return $this->belongsToMany(EquipmentUser::class, 'equipment_user_details')
            ->where('status', 'approved')
            ->whereNull('returned_at')
            ->withTimestamps();
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
        return $this->status === EquipmentStatusEnum::BORROWED->value && ! is_null($this->current_borrower_id);
    }

    /**
     * Check if equipment is available for borrowing
     */
    public function isAvailable(): bool
    {
        return $this->status === EquipmentStatusEnum::AVAILABLE->value &&
               $this->is_active &&
               is_null($this->current_borrower_id);
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

    /**
     * Get current borrower name (for display purposes)
     */
    public function getCurrentBorrowerName(): ?string
    {
        return $this->currentBorrower?->name;
    }

    /**
     * Get formatted borrowed duration
     */
    public function getBorrowedDuration(): ?string
    {
        if (! $this->borrowed_at || ! $this->isBorrowed()) {
            return null;
        }

        $days = $this->borrowed_at->diffInDays(now());

        return $days === 0 ? 'Today' : "{$days} days ago";
    }

    /**
     * Check if equipment is overdue
     */
    public function isOverdue(): bool
    {
        return $this->isBorrowed() &&
               $this->current_due_date &&
               $this->current_due_date->isPast();
    }
}
