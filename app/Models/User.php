<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'nip',
        'email',
        'password',
        'division_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Scope for global search across name and email
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }

    /**
     * Get the division this user belongs to
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Get all equipment borrowing history for this user
     */
    public function borrowingHistory(): HasMany
    {
        return $this->hasMany(EquipmentUser::class);
    }

    /**
     * Get currently borrowed equipment
     */
    public function currentlyBorrowed(): HasMany
    {
        return $this->hasMany(EquipmentUser::class)->where('status', 'borrowed');
    }

    /**
     * Get equipment borrowed by this user
     */
    public function borrowedEquipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'equipment_users')
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
     * Get overdue borrowings for this user
     */
    public function overdueBorrowings(): HasMany
    {
        return $this->hasMany(EquipmentUser::class)
            ->where('status', 'borrowed')
            ->where('due_date', '<', now());
    }
}
