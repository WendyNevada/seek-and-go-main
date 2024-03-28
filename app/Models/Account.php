<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    public function customers()
    {
        return $this->hasOne(Customer::class);
    }

    public function agencies()
    {
        return $this->hasOne(Agency::class);
    }
}
