<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefAttraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'attraction_code',
        'ref_zipcode_id',
        'attraction_name',
        'description',
        'address',
        'rating',
        'is_active',
        'qty',
        'promo_code'
    ];
    protected $primaryKey = 'ref_attraction_id';

    protected $casts = [
        'ref_attraction_id' => 'biginteger',
        'attraction_code' => 'string',
        'ref_zipcode_id' => 'biginteger',
        'attraction_name' => 'string',
        'description' => 'string',
        'address' => 'string',
        'rating' => 'double',
        'is_active' => 'boolean',
        'qty' => 'integer',
        'promo_code' => 'string'
    ];

    #region Getter Setter
    public function getRefAttractionIdAttribute($value)
    {
        return $value;
    }

    public function setRefAttractionIdAttribute($value)
    {
        $this->attributes['ref_attraction_id'] = $value;
    }

    public function getAttractionCodeAttribute($value)
    {
        return $value;
    }

    public function setAttractionCodeAttribute($value)
    {
        $this->attributes['attraction_code'] = $value;
    }

    public function getRefZipcodeIdAttribute($value)
    {
        return $value;
    }

    public function setRefZipcodeIdAttribute($value)
    {
        $this->attributes['ref_zipcode_id'] = $value;
    }

    public function getAttractionNameAttribute($value)
    {
        return $value;
    }

    public function setAttractionNameAttribute($value)
    {
        $this->attributes['attraction_name'] = $value;
    }

    public function getDescriptionAttribute($value)
    {
        return $value;
    }

    public function setDescriptionAttribute($value)
    {
        $this->attributes['description'] = $value;
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
