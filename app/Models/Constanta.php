<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Constanta extends Model
{
    use HasFactory;

    public static $homepageDataCount = 5;

    public static $orderStatusNew = "NEW";
}
