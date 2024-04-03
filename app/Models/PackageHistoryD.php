<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryD extends Model
{
    use HasFactory;

    protected $primaryKey = 'package_history_d_id';

    public function packageHistoryH()
    {
        return $this->belongsTo(PackageHistoryH::class);
    }
}
