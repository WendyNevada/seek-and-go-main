<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefVehicleInterface;
use App\Models\RefVehicle;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use Illuminate\Support\Facades\DB;

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

                $vehicle = RefVehicle::
                create(
                    [
                        'vehicle_code' => $request->vehicle_code,
                        'ref_zipcode_id' => $request->ref_zipcode_id,
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

                $vehicle = $vehicle
                ->update(
                    [
                        'ref_zipcode_id' => $request->ref_zipcode_id,
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
		return response()->json($vehicle);
    }

    public function GetVehicleHomepage()
    {
        $vehicle = RefVehicle::orderBy('rating', 'desc')->get()->take(Constanta::$homepageDataCount);
        return response()->json($vehicle);
    }

}