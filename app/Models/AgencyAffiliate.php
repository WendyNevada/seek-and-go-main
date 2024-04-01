<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgencyAffiliate extends Model
{
    use HasFactory;

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
