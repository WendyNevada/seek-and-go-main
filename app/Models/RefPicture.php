<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefPicture extends Model
{
    use HasFactory;

    protected $primaryKey = 'ref_picture_id';

    protected $fillable = [
        'ref_hotel_id',
        'ref_attraction_id',
        'ref_vehicle_id',
        'order_h_id',
        'image_url'
    ];

    #region Getter Setter
    public function getRefPictureIdAttribute($value)
    {
        return $value;
    }

    public function setRefPictureIdAttribute($value)
    {
        $this->attributes['ref_picture_id'] = $value;
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

    public function getOrderHIdAttribute($value)
    {
        return $value;
    }

    public function setOrderHIdAttribute($value)
    {
        $this->attributes['order_h_id'] = $value;
    }

    public function getImageUrlAttribute($value)
    {
        return $value;
    }

    public function setImageUrlAttribute($value)
    {
        $this->attributes['image_url'] = $value;
    }
    #endregion

    #region Relations
    public function refAttractions()
    {
        return $this->belongsTo(RefAttraction::class);
    }

    public function refHotels()
    {
        return $this->belongsTo(RefHotel::class);
    }

    public function refVehicles()
    {
        return $this->belongsTo(RefVehicle::class);
    }
    #endregion
}
