<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    // public function accounts()
    // {
    //     return $this->belongsTo(Account::class, 'account_id', 'account_id');
    // }

    public function promoHistories()
    {
        return $this->hasMany(PromoHistory::class);
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
