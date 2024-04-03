<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    protected $primaryKey = 'promo_id';

    public function promoHistories()
    {
        return $this->hasMany(PromoHistory::class);
    }
}
