<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefVehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_code',
        'ref_zipcode_id',
        'vehicle_type',
        'vehicle_brand',
        'vehicle_series',
        'vehicle_model',
        'vehicle_year',
        'vehicle_name',
        'description',
        'with_driver',
        'address',
        'rating',
        'is_active',
        'qty',
        'promo_code'
    ];

    protected $primaryKey = 'ref_vehicle_id';

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
