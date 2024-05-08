<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyPayment extends Model
{
    use HasFactory;

    protected $primaryKey = 'agency_payment_id';

    protected $fillable = [
        'agency_id',
        'payment_type',
        'account_no'
    ];

    #region Getter Setter
    public function getAgencyPaymentIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyPaymentIdAttribute($value)
    {
        $this->attributes['agency_payment_id'] = $value;
    }

    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getPaymentTypeAttribute($value)
    {
        return $value;
    }

    public function setPaymentTypeAttribute($value)
    {
        $this->attributes['payment_type'] = $value;
    }

    public function getAccountNoAttribute($value)
    {
        return $value;
    }

    public function setAccountNoAttribute($value)
    {
        $this->attributes['account_no'] = $value;
    }
    #endregion

    #region Relations
    public function agencies()
    {
        return $this->belongsTo(Agency::class, 'agency_id', 'agency_id');
    }
    #endregion
}
