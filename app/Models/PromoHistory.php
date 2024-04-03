<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoHistory extends Model
{
    use HasFactory;

    protected $primaryKey = 'promo_history_id';

    public function customers() {
        return $this->belongsTo(Customer::class);
    }

    public function promos() {
        return $this->belongsTo(Promo::class);
    }
}
