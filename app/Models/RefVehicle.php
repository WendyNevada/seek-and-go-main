<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'ref_vehicle_id',
        'vehicle_code',
        'ref_zipcode_id',
        'vehicle_type',
        'vehicle_brand',
        'vehicle_series',
        'vehicle_model',
        'vehicle_year',
        'vehicle_name',
        'description',
        'with_driver',
        'address',
        'rating',
        'is_active',
        'qty',
        'promo_code'
    ];

    protected $primaryKey = 'ref_vehicle_id';

    #region Getter Setter
    public function getRefVehicleIdAttribute($value)
    {
        return $value;
    }

    public function setRefVehicleIdAttribute($value)
    {
        $this->attributes['ref_vehicle_id'] = $value;
    }

    public function getVehicleCodeAttribute($value)
    {
        return $value;
    }

    public function setVehicleCodeAttribute($value)
    {
        $this->attributes['vehicle_code'] = $value;
    }

    public function getRefZipcodeIdAttribute($value)
    {
        return $value;
    }

    public function setRefZipcodeIdAttribute($value)
    {
        $this->attributes['ref_zipcode_id'] = $value;
    }

    public function getVehicleTypeAttribute($value)
    {
        return $value;
    }

    public function setVehicleTypeAttribute($value)
    {
        $this->attributes['vehicle_type'] = $value;
    }

    public function getVehicleBrandAttribute($value)
    {
        return $value;
    }

    public function setVehicleBrandAttribute($value)
    {
        $this->attributes['vehicle_brand'] = $value;
    }

    public function getVehicleSeriesAttribute($value)
    {
        return $value;
    }

    public function setVehicleSeriesAttribute($value)
    {
        $this->attributes['vehicle_series'] = $value;
    }

    public function getVehicleModelAttribute($value)
    {
        return $value;
    }

    public function setVehicleModelAttribute($value)
    {
        $this->attributes['vehicle_model'] = $value;
    }

    public function getVehicleYearAttribute($value)
    {
        return $value;
    }

    public function setVehicleYearAttribute($value)
    {
        $this->attributes['vehicle_year'] = $value;
    }

    public function getVehicleNameAttribute($value)
    {
        return $value;
    }

    public function setVehicleNameAttribute($value)
    {
        $this->attributes['vehicle_name'] = $value;
    }

    public function getDescriptionAttribute($value)
    {
        return $value;
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = $value;
    }

    public function getWithDriverAttribute($value)
    {
        return $value;
    }

    public function setWithDriverAttribute($value)
    {
        $this->attributes['with_driver'] = $value;
    }

    public function getAddressAttribute($value)
    {
        return $value;
    }

    public function setAddressAttribute($value)
    {
        $this->attributes['address'] = $value;
    }

    public function getRatingAttribute($value)
    {
        return $value;
    }

    public function setRatingAttribute($value)
    {
        $this->attributes['rating'] = $value;
    }

    public function getIsActiveAttribute($value)
    {
        return $value;
    }

    public function setIsActiveAttribute($value)
    {
        $this->attributes['is_active'] = $value;
    }

    public function getQtyAttribute($value)
    {
        return $value;
    }

    public function setQtyAttribute($value)
    {
        $this->attributes['qty'] = $value;
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
    public function refZipcodes()
    {
        return $this->belongsTo(RefZipcode::class);
    }

    public function packageDs()
    {
        return $this->hasMany(PackageD::class);
    }

    public function agencyAffiliate()
    {
        return $this->hasMany(AgencyAffiliate::class);
    }

    public function orderDs()
    {
        return $this->hasMany(OrderD::class);
    }

    public function refPictures()
    {
        return $this->hasMany(RefPicture::class);
    }
    #endregion
}
