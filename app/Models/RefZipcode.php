<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefZipcode extends Model
{
    use HasFactory;

    protected $primaryKey = 'ref_zipcode_id';

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
