<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentUserDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'equipment_user_id',
        'equipment_id',
    ];

    public function equipmentUser(): BelongsTo
    {
        return $this->belongsTo(EquipmentUser::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
