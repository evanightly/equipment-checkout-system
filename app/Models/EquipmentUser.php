<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EquipmentUser extends Model
{
    protected $fillable = [
        'equipment_id',
        'user_id',
        'approved_by',
        'borrowed_at',
        'due_date',
        'returned_at',
        'returned_to',
        'purpose',
        'notes',
        'status',
        'return_condition',
        'admin_notes',
    ];

    protected $casts = [
        'borrowed_at' => 'datetime',
        'due_date' => 'datetime',
        'returned_at' => 'datetime',
    ];

    /**
     * Get the equipment being borrowed
     */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Get the user who borrowed the equipment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who approved the borrowing
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the admin who received the returned equipment
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'returned_to');
    }

    /**
     * Get the equipment user details (for multiple equipment borrowing)
     */
    public function equipmentUserDetails(): HasMany
    {
        return $this->hasMany(EquipmentUserDetail::class);
    }

    /**
     * Get all equipment in this borrowing request (many-to-many through details)
     */
    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'equipment_user_details');
    }

    /**
     * Check if the borrowing is overdue
     */
    public function isOverdue(): bool
    {
        if ($this->returned_at || $this->status === 'returned') {
            return false;
        }

        return Carbon::now()->isAfter($this->due_date);
    }

    /**
     * Get the number of days overdue
     */
    public function getDaysOverdue(): int
    {
        if (! $this->isOverdue()) {
            return 0;
        }

        return Carbon::now()->diffInDays($this->due_date);
    }

    /**
     * Get status badge color
     */
    public function getStatusBadgeColor(): string
    {
        if ($this->isOverdue() && ! $this->returned_at) {
            return 'destructive';
        }

        return match ($this->status) {
            'pending' => 'secondary',
            'approved' => 'info',
            'borrowed' => 'warning',
            'returned' => 'success',
            'overdue' => 'destructive',
            'cancelled' => 'muted',
            default => 'secondary',
        };
    }

    /**
     * Get duration of borrowing in days
     */
    public function getBorrowingDuration(): int
    {
        $endDate = $this->returned_at ?? Carbon::now();

        return $endDate->diffInDays($this->borrowed_at);
    }
}
