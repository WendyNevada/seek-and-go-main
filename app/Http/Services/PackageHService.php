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
    private function getPackageByPackageCode($package_code)
    {
        $packageH = PackageH::where('package_code', $package_code)->first();
        return $packageH;
    }

    private function createPackageHAgency($package_code, $agency_id, $package_name, $description, $package_price, $is_active, $qty, $total_days): PackageH
    {
        $packageH = PackageH::create([
            'package_code' => $package_code,
            'agency_id' => $agency_id,
            'package_name' => $package_name,
            'description' => $description,
            'is_custom' => false,
            'package_price' => $package_price,
            'is_active' => $is_active,
            'qty' => $qty,
            'total_days' => $total_days
        ]);

        return $packageH;
    }

    private function createPackageHistoryH($package_code, $agency_id, $package_name, $is_custom, $package_price, $total_days): PackageHistoryH
    {
        $packageHistoryH = PackageHistoryH::create([
            'package_code' => $package_code,
            'agency_id' => $agency_id,
            'package_name' => $package_name,
            'is_custom' => $is_custom,
            'package_price' => $package_price,
            'total_days' => $total_days
        ]);

        return $packageHistoryH;
    }

    private function reformatDate($date): string
    {
        $strDate = $date;
                
        if(strpos($strDate, "T") == true)
        {
            $string = $date;
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

    private function createPackageHCustomer($customCode, $agency_id, $customer_id, $package_name, $description, $total_days): PackageH
    {
        $packageHCustom = new PackageH();
        $packageHCustom->package_code = $customCode;
        $packageHCustom->agency_id = $agency_id;
        $packageHCustom->customer_id = $customer_id;
        $packageHCustom->package_name = $package_name;
        $packageHCustom->description = $description;
        $packageHCustom->is_custom = true;
        $packageHCustom->custom_status = Constanta::$customPackageStatNew;
        $packageHCustom->package_price = null;
        $packageHCustom->is_active = true;
        $packageHCustom->qty = 1;
        $packageHCustom->total_days = $total_days;
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

    private function updatePackageH($package_h_id, $custom_status, $new_price)
    {
        $packageH = PackageH::lockForUpdate()->find($package_h_id);
        $packageH->custom_status = $custom_status;
        $packageH->package_price = $new_price;
        $packageH->save();

        return $packageH;
    }

    private function generateOrderNo(): string
    {
        $orderNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

        return $orderNo;
    }

    private function createOrderH($agency_id, $customer_id, $package_price, $order_no, $order_status): OrderH
    {
        $orderH = OrderH::create([
            'agency_id' => $agency_id,
            'customer_id' => $customer_id,
            'order_dt' => now(),
            'total_price' => $package_price,
            'order_no' => $order_no,
            'order_status' => $order_status
        ]);

        return $orderH;
    }

    private function createPackageHistoryDForCustom($package_history_h_id, $ref_hotel_id, $ref_attraction_id, $ref_vehicle_id, $start_dt, $end_dt)
    {
        $packageHistoryD = PackageHistoryD::create([
            'package_history_h_id' => $package_history_h_id,

            'hotel_name' => $ref_hotel_id == null ? null : RefHotel::where('ref_hotel_id', $ref_hotel_id)->value('hotel_name'),
            'hotel_start_dt' => $ref_hotel_id == null ? null : $start_dt,
            'hotel_end_dt' => $ref_hotel_id == null ? null : $end_dt,

            'attraction_name' => $ref_attraction_id == null ? null : RefAttraction::where('ref_attraction_id', $ref_attraction_id)->value('attraction_name'),
            'attraction_start_dt' => $ref_attraction_id == null ? null : $start_dt,
            'attraction_end_dt' => $ref_attraction_id == null ? null : $end_dt,

            'vehicle_name' => $ref_vehicle_id == null ? null : RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->value('vehicle_name'),
            'vehicle_start_dt' => $ref_vehicle_id == null ? null : $start_dt,
            'vehicle_end_dt' => $ref_vehicle_id == null ? null : $end_dt
        ]);

        return $packageHistoryD;
    }

    private function createOrderDForCustomPackage($order_h_id, $package_h_id, $package_history_h_id, $ref_hotel_id, $ref_attraction_id, $ref_vehicle_id, $start_dt, $end_dt)
    {
        $orderD = OrderD::create([
            'order_h_id' => $order_h_id,
            'package_h_id' => $package_h_id,
            'package_history_id' => $package_history_h_id,
            'ref_hotel_id' => $ref_hotel_id,
            'ref_attraction_id' => $ref_attraction_id,
            'ref_vehicle_id' => $ref_vehicle_id,
            'start_dt' => $start_dt,
            'end_dt' => $end_dt
        ]);

        return $orderD;
    }

    private function getListAttractionByAgencyId($agency_id)
    {
        $listAttraction = RefAttraction::
        join('agency_affiliates', 'agency_affiliates.ref_attraction_id', '=', 'ref_attractions.ref_attraction_id')->
        where('agency_affiliates.agency_id', $agency_id)->
        select('ref_attractions.ref_attraction_id', 'ref_attractions.attraction_name')->
        get();
        
        return $listAttraction;
    }

    private function getListVehicleByAgencyId($agency_id)
    {
        $listVehicle = RefVehicle::
        join('agency_affiliates', 'agency_affiliates.ref_vehicle_id', '=', 'ref_vehicles.ref_vehicle_id')->
        where('agency_affiliates.agency_id', $agency_id)->
        select('ref_vehicles.ref_vehicle_id', 'ref_vehicles.vehicle_name')->
        get();
        
        return $listVehicle;
    }

    private function getListHotelByAgencyId($agency_id)
    {
        $listHotel = RefHotel::
        join('agency_affiliates', 'agency_affiliates.ref_hotel_id', '=', 'ref_hotels.ref_hotel_id')->
        where('agency_affiliates.agency_id', $agency_id)->
        select('ref_hotels.ref_hotel_id', 'ref_hotels.hotel_name')->
        get();
        
        return $listHotel;
    }
    #endregion

    #region Public Function
    public function CreatePackageAgency(CreatePackageAgencyRequest $request)
    {
        try
        {
            $packageHCheck = $this->getPackageByPackageCode($request->package_code);

            if($packageHCheck == null)
            {
                DB::beginTransaction();

                $packageH = $this->createPackageHAgency($request->package_code, $request->agency_id, $request->package_name, $request->description, $request->package_price, $request->is_active, $request->qty, $request->total_days);

                $packageHistoryH = $this->createPackageHistoryH($request->package_code, $request->agency_id, $request->package_name, $request->is_custom, $request->package_price, $request->total_days);

                foreach($request->details as $detail)
                {
                    $strStartDate = null;
                    $strEndDate = null;

                    if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
                    {
                        $strStartDate = $this->reformatDate($detail['start_dt']);
                        $strEndDate = $this->reformatDate($detail['end_dt']);
                    }

                    $packageD = $this->createPackageD($packageH->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);

                    $packageHistoryD = $this->createPackageHistoryD($packageHistoryH->package_history_h_id, $packageD);
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

            $customCode = $this->generateCustomCode();

            $packageHCustom = $this->createPackageHCustomer($customCode, $request->agency_id, $request->customer_id, $request->package_name, $request->description, $request->total_days);

            foreach($request->details as $detail)
            {
                $strStartDate = null;
                $strEndDate = null;

                if($detail['start_dt'] != null && $detail['end_dt'] != null || $detail['start_dt'] != "" && $detail['end_dt'] != "")
                {
                    $strStartDate = $this->reformatDate($detail['start_dt']);
                    $strEndDate = $this->reformatDate($detail['end_dt']);
                }

                $packageD = $this->createPackageD($packageHCustom->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);

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
        $packageH = $this->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, Constanta::$customPackageStatNew);

        return response()->json($packageH);
    }

    public function GetApvCustomPackageByAgencyId(AgencyIdRequest $request)
    {
        $packageH = $this->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, Constanta::$customPackageStatApv);

        return response()->json($packageH);
    }

    public function ApproveCustomPackage(ApproveCustomPackageRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $packageH = $this->updatePackageH($request->package_h_id, Constanta::$customPackageStatApv, $request->new_price);

            $packageHistoryH = $this->createPackageHistoryH($packageH->package_code, $packageH->agency_id, $packageH->package_name, true, $packageH->package_price, $packageH->total_days);

            $orderNo = $this->generateOrderNo();

            $orderH = $this->createOrderH($packageH->agency_id, $packageH->customer_id, $packageH->package_price, $orderNo, Constanta::$orderStatusApproved);

            $packageDs = $packageH->packageDs;

            foreach($packageDs as $packageD)
            {
                $packageHistoryD = $this->createPackageHistoryDForCustom($packageHistoryH->package_history_h_id, $packageD->ref_hotel_id, $packageD->ref_attraction_id, $packageD->ref_vehicle_id, $packageD->start_dt, $packageD->end_dt);

                $orderD = $this->createOrderDForCustomPackage($orderH->order_h_id, $packageD->package_h_id, $packageHistoryH->package_history_h_id, $packageD->ref_hotel_id, $packageD->ref_attraction_id, $packageD->ref_vehicle_id, $packageD->start_dt, $packageD->end_dt);
            }

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
        $packageH = $this->getPackageByAgencyId($request->agency_id, false, Constanta::$homepageDataCount);

        return response()->json($packageH);
    }

    public function GetListAttractionForAgencyPackage(AgencyIdRequest $request)
    {
        $attraction = $this->getListAttractionByAgencyId($request->agency_id);

        return response()->json($attraction);
    }

    public function GetListHotelForAgencyPackage(AgencyIdRequest $request)
    {
        $hotel = $this->getListHotelByAgencyId($request->agency_id);

        return response()->json($hotel);
    }

    public function GetListVehicleForAgencyPackage(AgencyIdRequest $request)
    {
        $vehicle = $this->getListVehicleByAgencyId($request->agency_id);

        return response()->json($vehicle);
    }
    #endregion
}