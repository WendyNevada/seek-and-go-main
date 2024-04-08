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
}
