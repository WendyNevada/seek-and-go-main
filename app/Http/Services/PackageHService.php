<?php

namespace App\Http\Services;

use App\Http\Interfaces\PackageHInterface;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;
use App\Models\PackageH;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use Illuminate\Support\Facades\DB;
use App\Models\PackageD;
use App\Models\PackageHistoryD;
use App\Models\PackageHistoryH;
use App\Models\RefAttraction;
use App\Models\RefHotel;
use App\Models\RefVehicle;

class PackageHService implements PackageHInterface
{
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

                $packageHistoryH = PackageHistoryH::create([
                    'package_code' => $packageH->package_code,
                    'agency_id' => $packageH->agency_id,
                    'package_name' => $packageH->package_name,
                    'is_custom' => false,
                    'promo_code' => $packageH->promo_code,
                    'package_price' => $packageH->package_price,
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

                    $packageHistoryD = PackageHistoryD::create([
                        'package_history_h_id' => $packageHistoryH->package_history_h_id,

                        'hotel_name' => $packageD->ref_hotel_id == null ? null : RefHotel::where('ref_hotel_id', $packageD->ref_hotel_id)->first()->hotel_name,
                        'hotel_start_dt' => $packageD->ref_hotel_id == null ? null : $packageD->start_dt,
                        'hotel_end_dt' => $packageD->ref_hotel_id == null ? null : $packageD->end_dt,

                        'attraction_name' => $packageD->ref_attraction_id == null ? null : RefAttraction::where('ref_attraction_id', $packageD->ref_attraction_id)->first()->attraction_name,
                        'attraction_start_dt' => $packageD->ref_attraction_id == null ? null : $packageD->start_dt,
                        'attraction_end_dt' => $packageD->ref_attraction_id == null ? null : $packageD->end_dt,

                        'vehicle_name' => $packageD->ref_vehicle_id == null ? null : RefVehicle::where('ref_vehicle_id', $packageD->ref_vehicle_id)->first()->vehicle_name,
                        'vehicle_start_dt' => $packageD->ref_vehicle_id == null ? null : $packageD->start_dt,
                        'vehicle_end_dt' => $packageD->ref_vehicle_id == null ? null : $packageD->end_dt
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

    public function CreateCustomPackageCustomer(CreateCustomPackageCustomerRequest $request) 
    {
        try
        {
            DB::beginTransaction();

            $customCode = "CUST" . date("YmdHis") . rand(0, 9);

            $packageHCustom = new PackageH();
            $packageHCustom->package_code = $customCode;
            $packageHCustom->agency_id = $request->agency_id;
            $packageHCustom->customer_id = $request->customer_id;
            $packageHCustom->package_name = $request->package_name;
            $packageHCustom->description = $request->description;
            $packageHCustom->is_custom = true;
            $packageHCustom->promo_code = null;
            $packageHCustom->package_price = null;
            $packageHCustom->is_active = true;
            $packageHCustom->qty = 1;
            $packageHCustom->save();

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
                    'package_h_id' => $packageHCustom->package_h_id,
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
                'package_h_id' => $packageHCustom->package_h_id
            ], 200);
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