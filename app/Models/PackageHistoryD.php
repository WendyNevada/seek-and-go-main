<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryD extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_history_h_id',
        'hotel_name',
        'hotel_start_dt',
        'hotel_end_dt',
        'attraction_name',
        'attraction_start_dt',
        'attraction_end_dt',
        'vehicle_name',
        'vehicle_start_dt',
        'vehicle_end_dt'
    ];

    protected $primaryKey = 'package_history_d_id';

    protected $casts = [
        'package_history_d_id' => 'biginteger',
        'package_history_h_id' => 'biginteger',
        'hotel_name' => 'string',
        'hotel_start_dt' => 'datetime',
        'hotel_end_dt' => 'datetime',
        'attraction_name' => 'string',
        'attraction_start_dt' => 'datetime',
        'attraction_end_dt' => 'datetime',
        'vehicle_name' => 'string',
        'vehicle_start_dt' => 'datetime',
        'vehicle_end_dt' => 'datetime'
    ];

    #region Getter Setter
    public function getPackageHistoryDIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHistoryDIdAttribute($value)
    {
        $this->attributes['package_history_d_id'] = $value;
    }

    public function getPackageHistoryHIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHistoryHIdAttribute($value)
    {
        $this->attributes['package_history_h_id'] = $value;
    }

    public function getHotelNameAttribute($value)
    {
        return $value;
    }

    public function setHotelNameAttribute($value)
    {
        $this->attributes['hotel_name'] = $value;
    }

    public function getHotelStartDtAttribute($value)
    {
        return $value;
    }

    public function setHotelStartDtAttribute($value)
    {
        $this->attributes['hotel_start_dt'] = $value;
    }

    public function getHotelEndDtAttribute($value)
    {
        return $value;
    }

    public function setHotelEndDtAttribute($value)
    {
        $this->attributes['hotel_end_dt'] = $value;
    }

    public function getAttractionNameAttribute($value)
    {
        return $value;
    }

    public function setAttractionNameAttribute($value)
    {
        $this->attributes['attraction_name'] = $value;
    }

    public function getAttractionStartDtAttribute($value)
    {
        return $value;
    }

    public function setAttractionStartDtAttribute($value)
    {
        $this->attributes['attraction_start_dt'] = $value;
    }

    public function getAttractionEndDtAttribute($value)
    {
        return $value;
    }

    public function setAttractionEndDtAttribute($value)
    {
        $this->attributes['attraction_end_dt'] = $value;
    }

    public function getVehicleNameAttribute($value)
    {
        return $value;
    }

    public function setVehicleNameAttribute($value)
    {
        $this->attributes['vehicle_name'] = $value;
    }

    public function getVehicleStartDtAttribute($value)
    {
        return $value;
    }

    public function setVehicleStartDtAttribute($value)
    {
        $this->attributes['vehicle_start_dt'] = $value;
    }

    public function getVehicleEndDtAttribute($value)
    {
        return $value;
    }

    public function setVehicleEndDtAttribute($value)
    {
        $this->attributes['vehicle_end_dt'] = $value;
    }
    #endregion

    #region Relations
    public function packageHistoryH()
    {
        return $this->belongsTo(PackageHistoryH::class);
    }
    #endregion
}
