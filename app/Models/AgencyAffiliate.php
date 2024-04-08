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
}
