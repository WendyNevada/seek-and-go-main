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

    // public function accounts()
    // {
    //     return $this->belongsTo(Account::class, 'account_id', 'account_id');
    // }

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
}
