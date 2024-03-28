<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoHistory extends Model
{
    use HasFactory;

    public function customers() {
        return $this->belongsTo(Customer::class);
    }

    public function promos() {
        return $this->belongsTo(Promo::class);
    }
}
