<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    protected $primaryKey = 'promo_id';

    #region Getter Setter
    public function getPromoIdAttribute($value)
    {
        return $value;
    }

    public function setPromoIdAttribute($value)
    {
        $this->attributes['promo_id'] = $value;
    }

    public function getPromoCodeAttribute($value)
    {
        return $value;
    }

    public function setPromoCodeAttribute($value)
    {
        $this->attributes['promo_code'] = $value;
    }

    public function getStartDateAttribute($value)
    {
        return $value;
    }

    public function setStartDateAttribute($value)
    {
        $this->attributes['start_date'] = $value;
    }

    public function getEndDateAttribute($value)
    {
        return $value;
    }

    public function setEndDateAttribute($value)
    {
        $this->attributes['end_date'] = $value;
    }

    public function getIsHotelAttribute($value)
    {
        return $value;
    }

    public function setIsHotelAttribute($value)
    {
        $this->attributes['is_hotel'] = $value;
    }

    public function getIsAttractionAttribute($value)
    {
        return $value;
    }

    public function setIsAttractionAttribute($value)
    {
        $this->attributes['is_attraction'] = $value;
    }

    public function getIsVehicleAttribute($value)
    {
        return $value;
    }

    public function setIsVehicleAttribute($value)
    {
        $this->attributes['is_vehicle'] = $value;
    }

    public function getIsAmountAttribute($value)
    {
        return $value;
    }

    public function setIsAmountAttribute($value)
    {
        $this->attributes['is_amount'] = $value;
    }

    public function getAmountAttribute($value)
    {
        return $value;
    }

    public function setAmountAttribute($value)
    {
        $this->attributes['amount'] = $value;
    }

    public function getPercentAttribute($value)
    {
        return $value;
    }

    public function setPercentAttribute($value)
    {
        $this->attributes['percent'] = $value;
    }
    #endregion

    #region Relations
    public function promoHistories()
    {
        return $this->hasMany(PromoHistory::class);
    }
    #endregion
}
