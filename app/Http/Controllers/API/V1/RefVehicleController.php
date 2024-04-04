<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefVehicle;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;
use Illuminate\Support\Facades\DB;

class RefVehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRefVehicleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefVehicleRequest $request, RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefVehicle $refVehicle)
    {
        //
    }

    public function AddVehicle(StoreRefVehicleRequest $request)
    {
        try
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

            DB::commit();

            return [
                'status' => "ok",
                'message' => "success",
                'ref_vehicle_id' => $refVehicleId
            ];
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return [
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ];
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

                return [
                    'status' => "ok",
                    'message' => "success",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ];
            }
            else
            {
                return [
                    'status' => "error",
                    'message' => "data not found",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ];
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return [
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ];
        }
    }

    public function GetVehicleById(GetRefVehicleByIdRequest $request)
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $request->ref_vehicle_id)->first();
		return response()->json($vehicle);
    }
}
