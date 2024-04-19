<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory;

    protected $primaryKey = 'agency_id';

    protected $fillable = [
        'account_id',
        'agency_name',
        'npwp',
        'location'
    ];

    #region Getter Setter
    public function getAgencyIdAttribute($value)
    {
        return $value;
    }

    public function setAgencyIdAttribute($value)
    {
        $this->attributes['agency_id'] = $value;
    }

    public function getAgencyNameAttribute($value)
    {
        return $value;
    }

    public function setAgencyNameAttribute($value)
    {
        $this->attributes['agency_name'] = $value;
    }

    public function getNpwpAttribute($value)
    {
        return $value;
    }

    public function setNpwpAttribute($value)
    {
        $this->attributes['npwp'] = $value;
    }

    public function getLocationAttribute($value)
    {
        return $value;
    }

    public function setLocationAttribute($value)
    {
        $this->attributes['location'] = $value;
    }
    #endregion

    #region Relations
    public function agencyAffiliates()
    {
        return $this->hasMany(AgencyAffiliate::class);
    }

    public function packageHs()
    {
        return $this->hasMany(PackageH::class);
    }

    public function orderHs()
    {
        return $this->hasMany(OrderH::class);
    }

    public function packageHistoryHs()
    {
        return $this->hasMany(PackageHistoryH::class);
    }
    #endregion
}
