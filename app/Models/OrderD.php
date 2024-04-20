<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderD extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_d_id',
        'order_h_id',
        'package_h_id',
        'package_history_id',
        'ref_hotel_id',
        'ref_attraction_id',
        'ref_vehicle_id',
        'start_dt',
        'end_dt',
        'price'
    ];

    protected $primaryKey = 'order_d_id';

    protected $casts = [
        'order_d_id' => 'biginteger',
        'order_h_id' => 'biginteger',
        'package_h_id' => 'biginteger',
        'package_history_id' => 'biginteger',
        'ref_hotel_id' => 'biginteger',
        'ref_attraction_id' => 'biginteger',
        'ref_vehicle_id' => 'biginteger',
        'start_dt' => 'datetime',
        'end_dt' => 'datetime',
        'price' => 'double'
    ];

    #region Getter Setter
    public function getOrderDIdAttribute($value)
    {
        return $value;
    }

    public function setOrderDIdAttribute($value)
    {
        $this->attributes['order_d_id'] = $value;
    }

    public function getOrderHIdAttribute($value)
    {
        return $value;
    }

    public function setOrderHIdAttribute($value)
    {
        $this->attributes['order_h_id'] = $value;
    }

    public function getPackageHIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHIdAttribute($value)
    {
        $this->attributes['package_h_id'] = $value;
    }

    public function getPackageHistoryIdAttribute($value)
    {
        return $value;
    }

    public function setPackageHistoryIdAttribute($value)
    {
        $this->attributes['package_history_id'] = $value;
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

    public function getPriceAttribute($value)
    {
        return $value;
    }

    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = $value;
    }
    #endregion

    #region Relations
    public function orderH()
    {
        return $this->belongsTo(OrderH::class);
    }

    public function packageH()
    {
        return $this->belongsTo(PackageH::class);
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
