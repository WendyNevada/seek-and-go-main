<?php

use App\Http\Controllers\API\V1\AccountController;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\API\V1'], function () {

    Route::apiResource('GetAccount', AccountController::class);

    Route::get('articles', 'AccountController@index'); //langsung pada url

    Route::get('articles/{id}', 'AccountController@showId'); //langsung pada url

    #region Account

    Route::post('checkEmail', 'AccountController@checkEmail'); //pake postman

    Route::post('CreateAccountCustomer', 'AccountController@CreateAccountCustomer');

    Route::post('CreateAccountAgency', 'AccountController@CreateAccountAgency');

    Route::post('Login', 'AccountController@Login');

    Route::post('UpdateCustomerAccount', 'AccountController@UpdateCustomerAccount');

    Route::post('UpdateAgencyAccount', 'AccountController@UpdateAgencyAccount');

    Route::get('email/verify/{id}', 'AccountController@verify')->name('verification.verify'); // Make sure to keep this as your route name

    Route::get('email/resend', 'AccountController@resend')->name('verification.resend');

    Route::post('ForgotPasswordRequest', 'AccountController@ForgotPasswordRequest');
    
    Route::post('ResetPassword', 'AccountController@ResetPassword');

    Route::post('GetAccountInfoById', 'AccountController@GetAccountInfoById');

    Route::post('ChangePassword', 'AccountController@ChangePassword');

    #endregion

    #region Attraction

    Route::post('GetAttractionByCode', 'RefAttractionController@GetAttractionByCode');

    Route::post('GetAttractionById', 'RefAttractionController@GetAttractionById');

    Route::post('AddAttraction', 'RefAttractionController@AddAttraction');

    Route::post('EditAttractionById', 'RefAttractionController@EditAttractionById');

    Route::post('DeactivateAttractionById', 'RefAttractionController@DeactivateAttractionById');

    Route::post('GetAttractionHomepage', 'RefAttractionController@GetAttractionHomepage');

    Route::post('GetActiveAttractionByAgencyId', 'RefAttractionController@GetActiveAttractionByAgencyId');

    Route::post('RateAttraction', 'RefAttractionController@RateAttraction');

    #endregion

    #region Hotel

    Route::post('GetHotelById', 'RefHotelController@GetHotelById');

    Route::post('AddHotel', 'RefHotelController@AddHotel');

    Route::post('EditHotelById', 'RefHotelController@EditHotelById');

    Route::post('DeactivateHotelById', 'RefHotelController@DeactivateHotelById');

    Route::post('GetHotelHomepage', 'RefHotelController@GetHotelHomepage');

    Route::post('GetActiveHotelByAgencyId', 'RefHotelController@GetActiveHotelByAgencyId');

    Route::post('RateHotel', 'RefHotelController@RateHotel');

    #endregion

    #region Vehicle

    Route::post('AddVehicle', 'RefVehicleController@AddVehicle');

    Route::post('EditVehicleById', 'RefVehicleController@EditVehicleById');

    Route::post('DeactivateVehicleById', 'RefVehicleController@DeactivateVehicleById');

    Route::post('GetVehicleById', 'RefVehicleController@GetVehicleById');

    Route::post('GetVehicleHomepage', 'RefVehicleController@GetVehicleHomepage');

    Route::post('GetActiveVehicleByAgencyId', 'RefVehicleController@GetActiveVehicleByAgencyId');

    Route::post('RateVehicle', 'RefVehicleController@RateVehicle');

    #endregion

    #region Package

    Route::post('CreatePackageAgency', 'PackageHController@CreatePackageAgency');

    Route::post('EditPackageAgency', 'PackageHController@EditPackageAgency');

    Route::post('DeactivatePackageAgency', 'PackageHController@DeactivatePackageAgency');

    Route::post('CreateCustomPackageCustomer', 'PackageHController@CreateCustomPackageCustomer');

    Route::post('GetCustomPackageByCustomerId', 'PackageHController@GetCustomPackageByCustomerId');

    Route::post('GetCustomPackageByAgencyId', 'PackageHController@GetCustomPackageByAgencyId');

    Route::post('GetNewCustomPackageByAgencyId', 'PackageHController@GetNewCustomPackageByAgencyId');

    Route::post('GetApvCustomPackageByAgencyId', 'PackageHController@GetApvCustomPackageByAgencyId');

    Route::post('ApproveCustomPackage', 'PackageHController@ApproveCustomPackage');

    Route::post('RejectCustomPackage', 'PackageHController@RejectCustomPackage');

    Route::post('GetActivePackageHByAgencyId', 'PackageHController@GetActivePackageHByAgencyId');

    Route::post('GetPackageDataById', 'PackageHController@GetPackageDataById');

    Route::post('GetListAttractionForAgencyPackage', 'PackageHController@GetListAttractionForAgencyPackage');

    Route::post('GetListHotelForAgencyPackage', 'PackageHController@GetListHotelForAgencyPackage');

    Route::post('GetListVehicleForAgencyPackage', 'PackageHController@GetListVehicleForAgencyPackage');

    Route::post('GetAgencyPackagesHomepage', 'PackageHController@GetAgencyPackagesHomepage');

    #endregion

    #region Zipcode

    Route::post('GetAllArea1', 'RefZipcodeController@GetAllArea1');

    Route::post('GetArea2ByArea1', 'RefZipcodeController@GetArea2ByArea1');

    Route::post('GetArea3ByArea2AndArea1', 'RefZipcodeController@GetArea3ByArea2AndArea1');

    Route::post('GetArea4ByArea3AndArea2AndArea1', 'RefZipcodeController@GetArea4ByArea3AndArea2AndArea1');

    #endregion

    #region Order

    Route::post('CreateOrder', 'OrderHController@CreateOrder');

    Route::post('GetNewOrderDashboard', 'OrderHController@GetNewOrderDashboard');

    Route::post('GetNewOrderForCustomer', 'OrderHController@GetNewOrderForCustomer');

    Route::post('GetApvOrderForCustomer', 'OrderHController@GetApvOrderForCustomer');

    Route::post('GetCustomerOrderByIdAndStatus', 'OrderHController@GetCustomerOrderByIdAndStatus');

    Route::post('GetOrderById', 'OrderHController@GetOrderById');

    Route::post('ApproveOrder', 'OrderHController@ApproveOrder');

    Route::post('RejectOrder', 'OrderHController@RejectOrder');

    Route::post('CancelOrderAgency', 'OrderHController@CancelOrderAgency');
    
    Route::post('CancelOrderCustomer', 'OrderHController@CancelOrderCustomer');

    Route::post('CustPaidOrder', 'OrderHController@CustPaidOrder');

    Route::post('PaidOrder', 'OrderHController@PaidOrder');

    Route::post('RetryPaymentOrder', 'OrderHController@RetryPaymentOrder');

    Route::post('FinishOrder', 'OrderHController@FinishOrder');

    Route::post('SendEmailOrderApprove', 'OrderHController@SendEmailOrderApprove');

    Route::post('GetCustPaidOrder', 'OrderHController@GetCustPaidOrder');

    Route::post('GetStatsForOrder', 'OrderHController@GetStatsForOrder');

    Route::post('GetOrderDashboardByAgencyIdAndStatus', 'OrderHController@GetOrderDashboardByAgencyIdAndStatus');

    Route::post('UploadOrderImage', 'OrderHController@UploadOrderImage');

    Route::post('GetOrderImage', 'OrderHController@GetOrderImage');

    #endregion

    #region Trx

    Route::post('CustPayment', 'TrxController@CustPayment');

    Route::post('CancelCustPayment', 'TrxController@CancelCustPayment');

    Route::post('GetTrxByOrderHId', 'TrxController@GetTrxByOrderHId');

    Route::post('RateProduct', 'TrxController@RateProduct');

    #endregion

    #region Promo
    Route::post('AddPromo', 'PromoController@AddPromo');

    Route::post('GetPromoDeductionPriceAttraction', 'PromoController@GetPromoDeductionPriceAttraction');

    Route::post('GetPromoDeductionPriceHotel', 'PromoController@GetPromoDeductionPriceHotel');

    Route::post('GetPromoDeductionPriceVehicle', 'PromoController@GetPromoDeductionPriceVehicle');

    Route::post('AddPromoCounterHistory', 'PromoController@AddPromoCounterHistory');
    #endregion

    #region AgencyAffiliate
    Route::post('GetSearchHomepageCustomerData', 'AgencyAffiliateController@GetSearchHomepageCustomerData');

    Route::post('SearchAttractionCustomer', 'AgencyAffiliateController@SearchAttractionCustomer');

    Route::post('SearchHotelCustomer', 'AgencyAffiliateController@SearchHotelCustomer');

    Route::post('SearchVehicleCustomer', 'AgencyAffiliateController@SearchVehicleCustomer');

    Route::post('GetAgencyByAgencyId', 'AgencyAffiliateController@GetAgencyByAgencyId');

    Route::post('GetAllAgencyForAgencyPage', 'AgencyAffiliateController@GetAllAgencyForAgencyPage');

    Route::post('GetAllAgencySearchBar', 'AgencyAffiliateController@GetAllAgencySearchBar');
    #endregion

    #region AgencyPayment
    Route::post('GetAllAgencyPaymentByAgencyId', 'AgencyPaymentController@GetAllAgencyPaymentByAgencyId');

    Route::post('InsertAgencyPayment', 'AgencyPaymentController@InsertAgencyPayment');

    Route::post('EditAgencyPayment', 'AgencyPaymentController@EditAgencyPayment');

    Route::post('RemoveAgencyPayment', 'AgencyPaymentController@RemoveAgencyPayment');
    #endregion
});
