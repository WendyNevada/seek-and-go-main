<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryH extends Model
{
    use HasFactory;

    public function packageHistoryDs()
    {
        return $this->hasMany(PackageHistoryD::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function agency(){
        return $this->belongsTo(Agency::class);
    }
}
