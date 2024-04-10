<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefHotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_code',
        'ref_zipcode_id',
        'hotel_name',
        'description',
        'address',
        'rating',
        'is_active',
        'qty',
        'promo_code'
    ];
  
    protected $primaryKey = 'ref_hotel_id';

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

    public function refPictures()
    {
        return $this->hasMany(RefPicture::class);
    }
}
