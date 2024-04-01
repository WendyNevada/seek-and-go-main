<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefAttraction extends Model
{
    use HasFactory;

    public function refZipcodes()
    {
        return $this->belongsTo(RefZipcode::class);
    }

    public function packageDs()
    {
        return $this->hasMany(PackageD::class);
    }

    public function agencyAffiliate()
    {
        return $this->hasMany(AgencyAffiliate::class);
    }

    public function orderDs()
    {
        return $this->hasMany(OrderD::class);
    }
}
