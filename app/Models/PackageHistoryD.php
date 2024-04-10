<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageHistoryD extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_history_h_id',
        'hotel_name',
        'hotel_start_dt',
        'hotel_end_dt',
        'attraction_name',
        'attraction_start_dt',
        'attraction_end_dt',
        'vehicle_name',
        'vehicle_start_dt',
        'vehicle_end_dt'
    ];

    protected $primaryKey = 'package_history_d_id';

    public function packageHistoryH()
    {
        return $this->belongsTo(PackageHistoryH::class);
    }
}
