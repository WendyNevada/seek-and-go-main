<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trx extends Model
{
    use HasFactory;

    protected $primaryKey = 'trx_id';

    #region Getter Setter
    public function getTrxIdAttribute($value)
    {
        return $value;
    }

    public function setTrxIdAttribute($value)
    {
        $this->attributes['trx_id'] = $value;
    }

    public function getTrxNoAttribute($value)
    {
        return $value;
    }

    public function setTrxNoAttribute($value)
    {
        $this->attributes['trx_no'] = $value;
    }

    public function getOrderHIdAttribute($value)
    {
        return $value;
    }

    public function setOrderHIdAttribute($value)
    {
        $this->attributes['order_h_id'] = $value;
    }

    public function getPaymentStatusAttribute($value)
    {
        return $value;
    }

    public function setPaymentStatusAttribute($value)
    {
        $this->attributes['payment_status'] = $value;
    }
    #endregion
}
