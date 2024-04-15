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
}
