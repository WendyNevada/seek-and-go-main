<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromoHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'promo_id',
        'counter'
    ];

    protected $primaryKey = 'promo_history_id';

    #region Getter Setter
    public function getPromoHistoryIdAttribute($value)
    {
        return $value;
    }

    public function setPromoHistoryIdAttribute($value)
    {
        $this->attributes['promo_history_id'] = $value;
    }

    public function getCustomerIdAttribute($value)
    {
        return $value;
    }

    public function setCustomerIdAttribute($value)
    {
        $this->attributes['customer_id'] = $value;
    }

    public function getPromoIdAttribute($value)
    {
        return $value;
    }

    public function setPromoIdAttribute($value)
    {
        $this->attributes['promo_id'] = $value;
    }

    public function getCounterAttribute($value)
    {
        return $value;
    }

    public function setCounterAttribute($value)
    {
        $this->attributes['counter'] = $value;
    }
    #endregion

    #region Relations
    public function customers() {
        return $this->belongsTo(Customer::class);
    }

    public function promos() {
        return $this->belongsTo(Promo::class);
    }
    #endregion
}
