<?php

namespace App\Http\Services;

use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\RefVehicle;
use App\Models\RefZipcode;
use App\Models\AgencyAffiliate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefVehicleInterface;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;

class RefVehicleService implements RefVehicleInterface
{
    public function AddVehicle(StoreRefVehicleRequest $request)
    {
        try
        {
            $vehicleCheck = RefVehicle::where('vehicle_code', $request->vehicle_code)->first();

            if($vehicleCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = RefZipcode::
                    where('area_1', $request->area_1)->
                    where('area_2', $request->area_2)->
                    where('area_3', $request->area_3)->
                    where('area_4', $request->area_4)->
                    first()->ref_zipcode_id;

                $vehicle = RefVehicle::
                create(
                    [
                        'vehicle_code' => $request->vehicle_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'vehicle_type' => $request->vehicle_type,
                        'vehicle_brand' => $request->vehicle_brand,
                        'vehicle_series' => $request->vehicle_series,
                        'vehicle_model' => $request->vehicle_model,
                        'vehicle_year' => $request->vehicle_year,
                        'vehicle_name' => $request->vehicle_name,
                        'description' => $request->description,
                        'with_driver' => $request->with_driver,
                        'address' => $request->address,
                        'rating' => $request->rating,
                        'is_active' => $request->is_active,
                        'qty' => $request->qty,
                        'promo_code' => $request->promo_code
                    ]
                );

                $refVehicleId = $vehicle->ref_vehicle_id;

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $request->vehicle_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refVehiclePictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = new RefPicture();
                    $refPicture->ref_vehicle_id = $refVehicleId;
                    $refPicture->image_url = $url;
                    $refPicture->save();
                }

                $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_vehicle_id' => $refVehicleId,
                        'agency_id' => $request->agency_id,
                        'base_price' => $request->base_price,
                        'promo_code' => $request->promo_code_affiliate
                    ]
                );

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'ref_vehicle_id' => $refVehicleId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "data already exist",
                    'ref_vehicle_id' => "-"
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ], 500);
        }
    }

    public function EditVehicleById(UpdateRefVehicleRequest $request)
    {
        try
        {
            $vehicle = RefVehicle::where('ref_vehicle_id', $request->ref_vehicle_id);
            
            if($vehicle != null)
            {
                DB::beginTransaction();

                $refZipcodeId = RefZipcode::
                    where('area_1', $request->area_1)->
                    where('area_2', $request->area_2)->
                    where('area_3', $request->area_3)->
                    where('area_4', $request->area_4)->
                    first()->ref_zipcode_id;

                $vehicle = $vehicle
                ->update(
                    [
                        'ref_zipcode_id' => $refZipcodeId,
                        'vehicle_type' => $request->vehicle_type,
                        'vehicle_brand' => $request->vehicle_brand,
                        'vehicle_series' => $request->vehicle_series,
                        'vehicle_model' => $request->vehicle_model,
                        'vehicle_year' => $request->vehicle_year,
                        'vehicle_name' => $request->vehicle_name,
                        'description' => $request->description,
                        'with_driver' => $request->with_driver,
                        'address' => $request->address,
                        'is_active' => $request->is_active,
                        'qty' => $request->qty,
                        'promo_code' => $request->promo_code
                    ]
                );

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $vehicle->vehicle_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refVehiclePictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = RefPicture::where('ref_vehicle_id', $vehicle->ref_vehicle_id)->first();
                    if($refPicture != null)
                    {
                        $refPicture->image_url = $url;
                        $refPicture->save();
                    }
                    else
                    {
                        $refPicture = new RefPicture();
                        $refPicture->ref_vehicle_id = $vehicle->ref_vehicle_id;
                        $refPicture->image_url = $url;
                        $refPicture->save();
                    }
                }

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "data not found",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ], 500);
        }
    }

    public function GetVehicleById(GetRefVehicleByIdRequest $request)
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $request->ref_vehicle_id)->first();

        $vehiclePicture = RefPicture::where('ref_vehicle_id', $request->ref_vehicle_id)->first();

        $agencyAffiliate = AgencyAffiliate::where('ref_vehicle_id', $request->ref_vehicle_id)->first();

        if($vehicle != null)
        {
            if($vehiclePicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'vehicle' => $vehicle,
                    'picture_url' => $vehiclePicture->image_url,
                    'base_price' => $agencyAffiliate->base_price
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'vehicle' => $vehicle,
                    'picture_url' => "-",
                    'base_price' => $agencyAffiliate->base_price
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'vehicle' => "-",
                'picture_url' => "-",
                'base_price' => "-"
            ], 400);
        }
    }

    public function GetVehicleHomepage()
    {
        $vehicle = RefVehicle::where('is_active', '1')->orderBy('rating', 'desc')->limit(Constanta::$homepageDataCount)->get();

        foreach ($vehicle as $key => $value)
        {
            $picture = RefPicture::where('ref_vehicle_id', $value->ref_vehicle_id)->first();

            $base_price = AgencyAffiliate::where('ref_vehicle_id', $value->ref_vehicle_id)->first()->base_price;

            if($picture != null)
            {
                $image_url = $picture->image_url;
            }
            else
            {
                $image_url = "-";
            }

            $value->image_url = $image_url;
            $value->base_price = $base_price;
        }

        return response()->json($vehicle);
    }

    public function GetActiveVehicleByAgencyId(AgencyIdRequest $request)
    {
        $vehicle = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        select('ref_vehicles.*', 'agency_affiliates.base_price')->
        where('ref_vehicles.is_active', true)->
        where('agency_affiliates.agency_id', $request->agency_id)->
        limit(Constanta::$homepageDataCount)->
        get();

        return response()->json($vehicle);
    }

}