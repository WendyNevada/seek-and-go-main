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

    #endregion

    #region Attraction

    Route::post('GetAttractionByCode', 'RefAttractionController@GetAttractionByCode');

    Route::post('GetAttractionById', 'RefAttractionController@GetAttractionById');

    Route::post('AddAttraction', 'RefAttractionController@AddAttraction');

    Route::post('EditAttractionById', 'RefAttractionController@EditAttractionById');

    #endregion

    #region Hotel

    Route::post('GetHotelById', 'RefHotelController@GetHotelById');

    Route::post('AddHotel', 'RefHotelController@AddHotel');

    Route::post('EditHotelById', 'RefHotelController@EditHotelById');

    #endregion

    #region Vehicle

    Route::post('AddVehicle', 'RefVehicleController@AddVehicle');

    Route::post('EditVehicleById', 'RefVehicleController@EditVehicleById');

    Route::post('GetVehicleById', 'RefVehicleController@GetVehicleById');

    #endregion
});
