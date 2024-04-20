<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefZipcode extends Model
{
    use HasFactory;

    protected $primaryKey = 'ref_zipcode_id';

    protected $fillable = [
        'zipcode',
        'area_1',
        'area_2',
        'area_3',
        'area_4'
    ];

    protected $casts = [
        'ref_zipcode_id' => 'biginteger',
        'zipcode' => 'string',
        'area_1' => 'string',
        'area_2' => 'string',
        'area_3' => 'string',
        'area_4' => 'string'
    ];

    #region Getter Setter
    public function getRefZipcodeIdAttribute($value)
    {
        return $value;
    }

    public function setRefZipcodeIdAttribute($value)
    {
        $this->attributes['ref_zipcode_id'] = $value;
    }

    public function getZipcodeAttribute($value)
    {
        return $value;
    }

    public function setZipcodeAttribute($value)
    {
        $this->attributes['zipcode'] = $value;
    }

    public function getArea1Attribute($value)
    {
        return $value;
    }

    public function setArea1Attribute($value)
    {
        $this->attributes['area_1'] = $value;
    }

    public function getArea2Attribute($value)
    {
        return $value;
    }

    public function setArea2Attribute($value)
    {
        $this->attributes['area_2'] = $value;
    }

    public function getArea3Attribute($value)
    {
        return $value;
    }

    public function setArea3Attribute($value)
    {
        $this->attributes['area_3'] = $value;
    }

    public function getArea4Attribute($value)
    {
        return $value;
    }

    public function setArea4Attribute($value)
    {
        $this->attributes['area_4'] = $value;
    }
    #endregion

    #region Relations
    public function refHotels()
    {
        return $this->hasMany(RefHotel::class);
    }

    public function refAttractions()
    {
        return $this->hasMany(RefAttraction::class);
    }

    public function refVehicles()
    {
        return $this->hasMany(RefVehicle::class);
    }
    #endregion
}
