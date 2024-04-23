<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageD extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_h_id',
        'ref_hotel_id',
        'ref_attraction_id',
        'ref_vehicle_id',
        'start_dt',
        'end_dt'
    ];

    protected $primaryKey = 'package_d_id';

    #region Getter Setter
    public function getPackageDIdAttribute($value)
    {
        return $value;
    }

    public function setPackageDIdAttribute($value)
    {
        $this->attributes['package_d_id'] = $value;
    }

    public function getPackageHIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHIdAttribute($value)
    {
        $this->attributes['package_h_id'] = $value;
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

    public function getStartDtAttribute($value)
    {
        return $value;
    }

    public function setStartDtAttribute($value)
    {
        $this->attributes['start_dt'] = $value;
    }

    public function getEndDtAttribute($value)
    {
        return $value;
    }

    public function setEndDtAttribute($value)
    {
        $this->attributes['end_dt'] = $value;
    }
    #endregion

    #region Relations
    public function packageHs(){
        return $this->belongsTo(PackageH::class);
    }

    public function refHotels(){
        return $this->belongsTo(RefHotel::class);
    }

    public function refAttractions(){
        return $this->belongsTo(RefAttraction::class);
    }

    public function refVehicles(){
        return $this->belongsTo(RefVehicle::class);
    }
    #endregion
}
