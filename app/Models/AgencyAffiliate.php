<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyAffiliate extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_hotel_id',
        'ref_attraction_id',
        'ref_vehicle_id',
        'agency_id',
        'base_price',
        'promo_code'
    ];

    protected $primaryKey = 'agency_affiliate_id';

    #region Getter Setter
    public function getAgencyAffiliateIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyAffiliateIdAttribute($value)
    {
        $this->attributes['agency_affiliate_id'] = $value;
    }

    public function getRefHotelIdAttribute($value)
    {
        return $value;
    }

    public function setRefHotelIdAttribute($value)
    {
        $this->attributes['ref_hotel_id'] = $value;
    }

    public function getRefAttractionIdAttribute($value)
    {
        return $value;
    }

    public function setRefAttractionIdAttribute($value)
    {
        $this->attributes['ref_attraction_id'] = $value;
    }

    public function getRefVehicleIdAttribute($value)
    {
        return $value;
    }

    public function setRefVehicleIdAttribute($value)
    {
        $this->attributes['ref_vehicle_id'] = $value;
    }

    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getBasePriceAttribute($value)
    {
        return $value;
    }

    public function setBasePriceAttribute($value)
    {
        $this->attributes['base_price'] = $value;
    }

    public function getPromoCodeAttribute($value)
    {
        return $value;
    }

    public function setPromoCodeAttribute($value)
    {
        $this->attributes['promo_code'] = $value;
    }
    #endregion

    #region Relations
    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function refHotels()
    {
        return $this->belongsTo(RefHotel::class);
    }

    public function refAttractions()
    {
        return $this->belongsTo(RefAttraction::class);
    }

    public function refVehicles()
    {
        return $this->belongsTo(RefVehicle::class);
    }
    #endregion
}
