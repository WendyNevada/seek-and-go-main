<?php

namespace App\Http\Controllers\API\V1;

use App\Models\PackageH;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StorePackageHRequest;
use App\Http\Requests\V1\UpdatePackageHRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use Illuminate\Support\Facades\DB;
use App\Models\PackageD;

class PackageHController extends Controller
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
    public function store(StorePackageHRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PackageH $packageH)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PackageH $packageH)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePackageHRequest $request, PackageH $packageH)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PackageH $packageH)
    {
        //
    }

    public function CreatePackageAgency(CreatePackageAgencyRequest $request)
    {
        try
        {
            $packageHCheck = PackageH::where('package_code', $request->package_code)->first();

            if($packageHCheck == null)
            {
                DB::beginTransaction();

                $packageH = PackageH::create([
                    'package_code' => $request->package_code,
                    'agency_id' => $request->agency_id,
                    'package_name' => $request->package_name,
                    'description' => $request->description,
                    'is_custom' => false,
                    'promo_code' => $request->promo_code,
                    'package_price' => $request->package_price,
                    'is_active' => $request->is_active,
                    'qty' => $request->qty
                ]);

                foreach($request->details as $detail)
                {
                    $strStartDate = $detail['start_dt'];
                    $strEndDate = $detail['end_dt'];
                
                    if(strpos($strStartDate, "T") == true)
                    {
                        $string = $detail->start_dt;
                        $parts = explode("T", $string);
                        $strStartDate = $parts[0];
                    }

                    if(strpos($strEndDate, "T") == true)
                    {
                        $string = $detail->end_dt;
                        $parts = explode("T", $string);
                        $strEndDate = $parts[0];
                    }

                    $packageD = PackageD::create([
                        'package_h_id' => $packageH->package_h_id,
                        'ref_hotel_id' => $detail['ref_hotel_id'],
                        'ref_attraction_id' => $detail['ref_attraction_id'],
                        'ref_vehicle_id' => $detail['ref_vehicle_id'],
                        'start_dt' => $strStartDate,
                        'end_dt' => $strEndDate
                    ]);
                }

                DB::commit();

                return response()->json([
                    'status' => 'ok',
                    'message' => 'success',
                    'package_h_id' => $packageH->package_h_id
                ], 200);

            }
            else
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Package code already exist',
                    'package_h_id' => '-'
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'package_h_id' => '-'
            ], 500);
        }
    }
}
