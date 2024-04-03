<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageH extends Model
{
    use HasFactory;

    protected $primaryKey = 'package_h_id';

    public function packageDs(){
        return $this->hasMany(PackageD::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function agency(){
        return $this->belongsTo(Agency::class);
    }

    public function orderDs(){
        return $this->hasMany(OrderD::class);
    }
}
