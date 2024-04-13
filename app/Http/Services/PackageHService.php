<?php

namespace App\Http\Services;

use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageD;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use App\Models\PackageHistoryD;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\PackageHInterface;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\ApproveCustomPackageRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

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
                    $strStartDate = null;
                    $strEndDate = null;

                    if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
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
            $packageHCustom->custom_status = Constanta::$customPackageStatNew;
            $packageHCustom->promo_code = null;
            $packageHCustom->package_price = null;
            $packageHCustom->is_active = true;
            $packageHCustom->qty = 1;
            $packageHCustom->save();

            foreach($request->details as $detail)
            {
                $strStartDate = null;
                $strEndDate = null;

                if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
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

    public function GetNewCustomPackageByAgencyId(AgencyIdRequest $request)
    {
        $packageH = PackageH::
            where('agency_id', $request->agency_id)->
            where('is_custom', true)->
            where('custom_status', Constanta::$customPackageStatNew)->
            with('packageDs')->
            get();

        return response()->json($packageH);
    }

    public function GetApvCustomPackageByAgencyId(AgencyIdRequest $request)
    {
        $packageH = PackageH::
            where('agency_id', $request->agency_id)->
            where('is_custom', true)->
            where('custom_status', Constanta::$customPackageStatApv)->
            with('packageDs')->
            get();

        return response()->json($packageH);
    }

    public function ApproveCustomPackage(ApproveCustomPackageRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $packageH = PackageH::lockForUpdate()->find($request->package_h_id);
            $packageH->custom_status = Constanta::$customPackageStatApv;
            $packageH->package_price = $request->new_price;
            $packageH->save();

            $packageHistoryH = PackageHistoryH::create([
                'package_code' => $packageH->package_code,
                'agency_id' => $packageH->agency_id,
                'customer_id' => $packageH->customer_id,
                'package_name' => $packageH->package_name,
                'is_custom' => true,
                'promo_code' => $packageH->promo_code,
                'package_price' => $packageH->package_price
            ]);

            $orderNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

            $orderH = OrderH::create([
                'agency_id' => $packageH->agency_id,
                'customer_id' => $packageH->customer_id,
                'order_dt' => now(),
                'total_price' => $packageH->package_price,
                'order_no' => $orderNo,
                'order_status' => Constanta::$orderStatusApproved
            ]);

            $packageDs = $packageH->packageDs;
            $orderDs = collect();

            foreach($packageDs as $packageD)
            {
                $packageHistoryD = PackageHistoryD::create([
                    'package_history_h_id' => $packageHistoryH->package_history_h_id,

                    'hotel_name' => $packageD->ref_hotel_id == null ? null : RefHotel::where('ref_hotel_id', $packageD->ref_hotel_id)->value('hotel_name'),
                    'hotel_start_dt' => $packageD->ref_hotel_id == null ? null : $packageD->start_dt,
                    'hotel_end_dt' => $packageD->ref_hotel_id == null ? null : $packageD->end_dt,

                    'attraction_name' => $packageD->ref_attraction_id == null ? null : RefAttraction::where('ref_attraction_id', $packageD->ref_attraction_id)->value('attraction_name'),
                    'attraction_start_dt' => $packageD->ref_attraction_id == null ? null : $packageD->start_dt,
                    'attraction_end_dt' => $packageD->ref_attraction_id == null ? null : $packageD->end_dt,

                    'vehicle_name' => $packageD->ref_vehicle_id == null ? null : RefVehicle::where('ref_vehicle_id', $packageD->ref_vehicle_id)->value('vehicle_name'),
                    'vehicle_start_dt' => $packageD->ref_vehicle_id == null ? null : $packageD->start_dt,
                    'vehicle_end_dt' => $packageD->ref_vehicle_id == null ? null : $packageD->end_dt
                ]);

                $orderDs->push(OrderD::create([
                    'order_h_id' => $orderH->order_h_id,
                    'package_h_id' => $packageD->package_h_id,
                    'package_history_id' => $packageHistoryH->package_history_h_id,
                    'ref_hotel_id' => $packageD->ref_hotel_id,
                    'ref_attraction_id' => $packageD->ref_attraction_id,
                    'ref_vehicle_id' => $packageD->ref_vehicle_id,
                    'start_dt' => $packageD->start_dt,
                    'end_dt' => $packageD->end_dt
                ]));
            }

            $orderDs->each(function($orderD) use ($orderH)
            {
                $orderD->order_h_id = $orderH->order_h_id;
                $orderD->save();
            });

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Custom package approved',
                'package_h_id' => $packageH->package_h_id,
                'order_h_id' => $orderH->order_h_id
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'package_h_id' => '-',
                'order_h_id' => '-'
            ], 500);
        }
    }

    public function GetActivePackageHByAgencyId(AgencyIdRequest $request)
    {
        $packageH = PackageH::where('agency_id', $request->agency_id)
            ->where('is_custom', false)
            ->limit(Constanta::$homepageDataCount)
            ->get();

        return response()->json($packageH);
    }
}