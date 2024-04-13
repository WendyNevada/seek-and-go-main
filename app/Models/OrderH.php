<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderH extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'customer_id',
        'order_no',
        'order_dt',
        'total_price',
        'order_status'
    ];

    protected $primaryKey = 'order_h_id';

    public function orderDs()
    {
        return $this->hasMany(OrderD::class, 'order_h_id');
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
