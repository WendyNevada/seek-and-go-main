<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefZipcode extends Model
{
    use HasFactory;

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
}
