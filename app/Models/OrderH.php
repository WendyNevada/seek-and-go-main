<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderH extends Model
{
    use HasFactory;

    public function orderDs()
    {
        return $this->hasMany(OrderD::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function trxs() {
        return $this->hasOne(Trx::class);
    }
}
