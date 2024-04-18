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
    #region Private Function

    private function getPackageByPackageCode($package_code): PackageH
    {
        $packageH = PackageH::where('package_code', $package_code)->first();
        return $packageH;
    }

    private function createPackageHAgency($package_code, $agency_id, $package_name, $description, $promo_code, $package_price, $is_active, $qty): PackageH
    {
        $packageH = PackageH::create([
            'package_code' => $package_code,
            'agency_id' => $agency_id,
            'package_name' => $package_name,
            'description' => $description,
            'is_custom' => false,
            'promo_code' => $promo_code,
            'package_price' => $package_price,
            'is_active' => $is_active,
            'qty' => $qty
        ]);

        return $packageH;
    }

    private function createPackageHistoryHAgency($package_code, $agency_id, $package_name, $is_custom, $promo_code, $package_price): PackageHistoryH
    {
        $packageHistoryH = PackageHistoryH::create([
            'package_code' => $package_code,
            'agency_id' => $agency_id,
            'package_name' => $package_name,
            'is_custom' => false,
            'promo_code' => $promo_code,
            'package_price' => $package_price,
        ]);

        return $packageHistoryH;
    }

    private function reformatDate($date): string
    {
        $strDate = $date->birth_date;
                
        if(strpos($strDate, "T") == true)
        {
            $string = $date->birth_date;
            $parts = explode("T", $string);
            $strDate = $parts[0];
        }

        return $strDate;
    }

    private function createPackageD($package_h_id, $ref_hotel_id, $ref_attraction_id, $ref_vehicle_id, $strStartDate, $strEndDate): PackageD
    {
        $packageD = PackageD::create([
            'package_h_id' => $package_h_id,
            'ref_hotel_id' => $ref_hotel_id,
            'ref_attraction_id' => $ref_attraction_id,
            'ref_vehicle_id' => $ref_vehicle_id,
            'start_dt' => $strStartDate,
            'end_dt' => $strEndDate
        ]);

        return $packageD;
    }

    private function createPackageHistoryD($package_history_h_id, $packageD): PackageHistoryD
    {
        $packageHistoryD = PackageHistoryD::create([
            'package_history_h_id' => $package_history_h_id,

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

        return $packageHistoryD;
    }

    private function generateCustomCode(): string
    {
        $customCode = "CUST" . date("YmdHis") . rand(0, 9);

        return $customCode;
    }

    private function createPackageHCustomer($customCode, $agency_id, $customer_id, $package_name, $description): PackageH
    {
        $packageHCustom = new PackageH();
        $packageHCustom->package_code = $customCode;
        $packageHCustom->agency_id = $agency_id;
        $packageHCustom->customer_id = $customer_id;
        $packageHCustom->package_name = $package_name;
        $packageHCustom->description = $description;
        $packageHCustom->is_custom = true;
        $packageHCustom->custom_status = Constanta::$customPackageStatNew;
        $packageHCustom->promo_code = null;
        $packageHCustom->package_price = null;
        $packageHCustom->is_active = true;
        $packageHCustom->qty = 1;
        $packageHCustom->save();

        return $packageHCustom;
    }

    private function getCustomPackageByAgencyIdAndStatus($agency_id, $is_custom = false, $custom_status)
    {
        $packageH = PackageH::
            where('agency_id', $agency_id)->
            where('is_custom', $custom_status)->
            where('custom_status', $custom_status)->
            with('packageDs')->
            get();
        

        return $packageH;
    }

    private function getPackageByAgencyId($agency_id, $is_custom = false, $limit)
    {
        $packageH = PackageH::where('agency_id', $agency_id)
            ->where('is_custom', $is_custom)
            ->limit($limit)
            ->get();

        return $packageH;
    }

    #endregion

    #region Public Function
    public function CreatePackageAgency(CreatePackageAgencyRequest $request)
    {
        $packageHService = new PackageHService();
        try
        {
            $packageHCheck = $packageHService->getPackageByPackageCode($request->package_code);

            if($packageHCheck == null)
            {
                DB::beginTransaction();

                $packageH = $packageHService->createPackageHAgency($request->package_code, $request->agency_id, $request->package_name, $request->description, $request->promo_code, $request->package_price, $request->is_active, $request->qty);

                $packageHistoryH = $packageHService->createPackageHistoryHAgency($request->package_code, $request->agency_id, $request->package_name, $request->is_custom, $request->promo_code, $request->package_price);

                foreach($request->details as $detail)
                {
                    $strStartDate = null;
                    $strEndDate = null;

                    if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
                    {
                        $strStartDate = $packageHService->reformatDate($detail['start_dt']);
                        $strEndDate = $packageHService->reformatDate($detail['end_dt']);
                    }

                    $packageD = $packageHService->createPackageD($packageH->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);

                    $packageHistoryD = $packageHService->createPackageHistoryD($packageHistoryH->package_history_h_id, $packageD);
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
        $packageHService = new PackageHService();
        try
        {
            DB::beginTransaction();

            $customCode = $packageHService->generateCustomCode();

            $packageHCustom = $packageHService->createPackageHCustomer($customCode, $request->agency_id, $request->customer_id, $request->package_name, $request->description);

            foreach($request->details as $detail)
            {
                $strStartDate = null;
                $strEndDate = null;

                if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
                {
                    $strStartDate = $packageHService->reformatDate($detail['start_dt']);
                    $strEndDate = $packageHService->reformatDate($detail['end_dt']);
                }

                $packageD = $packageHService->createPackageD($packageHCustom->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);

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
        $packageHService = new PackageHService();

        $packageH = $packageHService->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, Constanta::$customPackageStatNew);

        return response()->json($packageH);
    }

    public function GetApvCustomPackageByAgencyId(AgencyIdRequest $request)
    {
        $packageHService = new PackageHService();

        $packageH = $packageHService->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, Constanta::$customPackageStatApv);

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
        $packageHService = new PackageHService;

        $packageH = $packageHService->getPackageByAgencyId($request->agency_id, false, Constanta::$homepageDataCount);

        return response()->json($packageH);
    }
    #endregion
}