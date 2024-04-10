<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Constanta extends Model
{
    use HasFactory;

    #region homepage
    public static $homepageDataCount = 5;
    #endregion

    #region order status
    public static $orderStatusNew = "NEW";
    #endregion

    #region ref picture
    public static $refPictureDisk = "public";
    public static $refAttractionPictureDirectory = "ref_attraction_pictures";
    public static $refHotelPictureDirectory = "ref_hotel_pictures";
    public static $refVehiclePictureDirectory = "ref_vehicle_pictures";
    #endregion
}
