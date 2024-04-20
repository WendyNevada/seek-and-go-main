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

    protected $casts = [
        'order_h_id' => 'biginteger',
        'agency_id' => 'biginteger',
        'customer_id' => 'biginteger',
        'order_no' => 'string',
        'order_dt' => 'datetime',
        'total_price' => 'double',
        'order_status' => 'string'
    ];

    #region Getter Setter
    public function getOrderHIdAttribute($value)
    {
        return $value;
    }

    public function setOrderHIdAttribute($value)
    {
        $this->attributes['order_h_id'] = $value;
    }

    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getCustomerIdAttribute($value)
    {
        return $value;
    }

    public function setCustomerIdAttribute($value)
    {
        $this->attributes['customer_id'] = $value;
    }

    public function getOrderNoAttribute($value)
    {
        return $value;
    }

    public function setOrderNoAttribute($value)
    {
        $this->attributes['order_no'] = $value;
    }

    public function getOrderDtAttribute($value)
    {
        return $value;
    }

    public function setOrderDtAttribute($value)
    {
        $this->attributes['order_dt'] = $value;
    }

    public function getTotalPriceAttribute($value)
    {
        return $value;
    }

    public function setTotalPriceAttribute($value)
    {
        $this->attributes['total_price'] = $value;
    }

    public function getOrderStatusAttribute($value)
    {
        return $value;
    }

    public function setOrderStatusAttribute($value)
    {
        $this->attributes['order_status'] = $value;
    }
    #endregion

    #region Relations
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
    #endregion
}
