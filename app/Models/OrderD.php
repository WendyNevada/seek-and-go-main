<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderD extends Model
{
    use HasFactory;

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
