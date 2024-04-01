<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryD extends Model
{
    use HasFactory;

    public function packageHistoryH()
    {
        return $this->belongsTo(PackageHistoryH::class);
    }
}
