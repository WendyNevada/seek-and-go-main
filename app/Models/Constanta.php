<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Constanta extends Model
{
    use HasFactory;

    #region role
    public static $roleCustomer = "Customer";
    public static $roleAgency = "Agency";
    #endregion

    #region homepage
    public static $homepageDataCount = 5;
    #endregion

    #region package
    public static $customPackageStatNew = "NEW";
    public static $customPackageStatApv = "APV";
    #endregion

    #region trx
    public static $trxConst = "TRX";
    public static $trxStatusNew = "NEW";
    #endregion

    #region order
    public static $orderConst = "ORD";
    public static $orderStatusNew = "NEW";
    public static $orderStatusApproved = "APV";
    public static $orderStatusRejected = "RJT";
    public static $orderStatusCanceled = "CAN";
    public static $orderStatusPaid = "PAY";
    public static $orderStatusCustPaid = "CPY";
    public static $orderStatusRetryPay = "RTP";
    public static $orderStatusFinished = "FIN";
    #endregion

    #region order dashboard
    public static $orderDashboardDataCount = 5;
    #endregion

    #region ref picture
    public static $refPictureDisk = "public";
    public static $refAttractionPictureDirectory = "ref_attraction_pictures";
    public static $refHotelPictureDirectory = "ref_hotel_pictures";
    public static $refVehiclePictureDirectory = "ref_vehicle_pictures";
    public static $orderHPictureDirectory = "order_h_pictures";
    #endregion

    #region list environment
    public static $enviLocal = "http://localhost:3000/";
    #endregion

    #region product
    public static $attraction = "attraction";
    public static $hotel = "hotel";
    public static $vehicle = "vehicle";
    public static $package = "package";
    #endregion
}
