<?php

namespace App\Http\Services;

use App\Models\Agency;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\Account;
use App\Models\Customer;
use App\Models\PackageD;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use App\Models\PackageHistoryD;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\CustomPackageRequestEmail;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\PackageHInterface;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\EditPackageAgencyRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\ApproveCustomPackageRequest;
use App\Http\Requests\V2\GetCustomPackageAgencyRequest;
use App\Http\Requests\V2\GetCustomPackageCustomerRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

class PackageHService implements PackageHInterface
{
    #region Private Function
    private function getPackageHById($package_h_id)
    {
        $packageH = PackageH::find($package_h_id);
        return $packageH;
    }

    private function getPackageHWithDById($package_h_id)
    {
        $packageH = PackageH::
        with('packageDs')->
        leftjoin('customers', 'package_h_s.customer_id', '=', 'customers.customer_id')->
        leftjoin('agencies', 'package_h_s.agency_id', '=', 'agencies.agency_id')->
        leftjoin('accounts', 'customers.account_id', '=', 'accounts.account_id')->
        leftjoin('accounts as accounts2', 'agencies.account_id', '=', 'accounts2.account_id')->
        select('package_h_s.*', 'customers.customer_name', 'accounts.phone as customer_phone', 'accounts.email as customer_email', 'agencies.agency_name', 'accounts2.phone as agency_phone', 'accounts2.email as agency_email')->
        find($package_h_id);

        return $packageH;
    }

    private function getPackageByPackageCode($package_code)
    {
        $packageH = PackageH::where('package_code', $package_code)->first();
        return $packageH;
    }

    private function createPackageHAgency($package_code, $agency_id, $package_name, $description, $package_price, $qty, $total_days): PackageH
    {
        $packageH = PackageH::create([
            'package_code' => $package_code,
            'agency_id' => $agency_id,
            'package_name' => $package_name,
            'description' => $description,
            'is_custom' => false,
            'package_price' => $package_price,
            'is_active' => true,
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

    private function getCustomPackageByCustomerIdAndStatus($customer_id, $is_custom = false, $custom_status)
    {
        if($custom_status == null)
        {
            $packageH = PackageH::
            where('customer_id', $customer_id)->
            where('is_custom', $is_custom)->
            join('agencies', 'package_h_s.agency_id', '=', 'agencies.agency_id')->
            select('package_h_s.*', 'agencies.agency_name')->
            with('packageDs')->
            get();
            return $packageH;
        }
        else
        {
            $packageH = PackageH::
            where('customer_id', $customer_id)->
            where('is_custom', $is_custom)->
            where('custom_status', $custom_status)->
            join('agencies', 'package_h_s.agency_id', '=', 'agencies.agency_id')->
            select('package_h_s.*', 'agencies.agency_name')->
            with('packageDs')->
            get();
            return $packageH;
        }
    }

    private function getCustomPackageByAgencyIdAndStatus($agency_id, $is_custom = false, $custom_status)
    {
        if($custom_status == null)
        {
            $packageH = PackageH::
            where('agency_id', $agency_id)->
            where('is_custom', $is_custom)->
            join('customers', 'package_h_s.customer_id', '=', 'customers.customer_id')->
            select('package_h_s.*', 'customers.customer_name')->
            with('packageDs')->
            get();
            return $packageH;
        }
        else
        {
            $packageH = PackageH::
            where('agency_id', $agency_id)->
            where('is_custom', $is_custom)->
            where('custom_status', $custom_status)->
            join('customers', 'package_h_s.customer_id', '=', 'customers.customer_id')->
            select('package_h_s.*', 'customers.customer_name')->
            with('packageDs')->
            get();
            return $packageH;
        }
    }

    private function getPackageByAgencyId($agency_id, $is_custom = false, $limit = null)
    {
        if($limit == null)
        {
            $packageH = PackageH::where('agency_id', $agency_id)
            ->where('is_custom', $is_custom)
            ->where('qty', '>', '0')
            ->where('is_active', '1')
            ->with('packageDs')
            ->get();

        }
        else
        {
            $packageH = PackageH::where('agency_id', $agency_id)
                ->where('is_custom', $is_custom)
                ->where('qty', '>', '0')
                ->where('is_active', '1')
                ->limit($limit)
                ->with('packageDs')
                ->get();
        }

        return $packageH;
    }

    private function updatePackageH($package_h_id, $custom_status, $new_price, $total_days)
    {
        $packageH = PackageH::lockForUpdate()->find($package_h_id);
        $packageH->custom_status = $custom_status;
        $packageH->package_price = $new_price;
        $packageH->total_days = $total_days;
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

    private function createOrderDForCustomPackage($order_h_id, $package_h_id, $package_history_h_id, $ref_hotel_id, $ref_attraction_id, $ref_vehicle_id, $start_dt, $end_dt, $qty)
    {
        $orderD = OrderD::create([
            'order_h_id' => $order_h_id,
            'package_h_id' => $package_h_id,
            'package_history_id' => $package_history_h_id,
            'ref_hotel_id' => $ref_hotel_id,
            'ref_attraction_id' => $ref_attraction_id,
            'ref_vehicle_id' => $ref_vehicle_id,
            'start_dt' => $start_dt,
            'end_dt' => $end_dt,
            'qty' => $qty
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

    private function updateIsActivePackageH($package_h_id, $is_active)
    {
        PackageH::where('package_h_id', $package_h_id)->
        update([
            'is_active' => $is_active
        ]);
    }

    private function updatePackageHForAgency($package_h_id, $package_name, $description, $package_price, $qty, $total_days)
    {
        $packageH = PackageH::where('package_h_id', $package_h_id)->
        update([
            'package_name' => $package_name,
            'description' => $description,
            'package_price' => $package_price,
            'qty' => $qty,
            'total_days' => $total_days
        ]);

        return $packageH;
    }

    private function deleteRangePackageD($package_h_id)
    {
        $packageH = PackageH::where('package_h_id', $package_h_id)->first();

        if($packageH != null)
        {
            $packageH->packageDs()->delete();
        }
    }

    private function checkPackageDataEmpty($data)
    {
        if(count($data) <= 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function getAgencyByAgencyId($agency_id)
    {
        return Agency::where('agency_id', $agency_id)->first();
    }

    private function getCustomerByCustomerId($customer_Id)
    {
        return Customer::where('customer_id', $customer_Id)->first();
    }

    private function getEmailByForeignId($id, $role)
    {
        if($role == Constanta::$roleCustomer)
        {
            $customer = Customer::where('customer_id', $id)->first();
            $email = Account::where('account_id', $customer->account_id)->first()->email;
        }
        else
        {
            $agency = Agency::where('agency_id', $id)->first();
            $email = Account::where('account_id', $agency->account_id)->first()->email;
        }

        return $email;
    }

    private function sendEmailCustomPackageRequest($mailTo, $customerName)
    {
        Mail::to($mailTo)->send(new CustomPackageRequestEmail($customerName));
    }

    private function checkValidDateOnPackageRequest($detail)
    {
        if(isset($detail['start_dt']) && isset($detail['end_dt']) && $detail['start_dt'] != null && $detail['end_dt'] != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkPackageInOrder($package_h_id): bool
    {
        $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($package_h_id) {
                    $query->where('package_h_id', $package_h_id);
                })
                ->whereIn('order_status', [
                    Constanta::$orderStatusNew,
                    Constanta::$orderStatusApproved,
                    Constanta::$orderStatusPaid,
                    Constanta::$orderStatusCustPaid,
                    Constanta::$orderStatusRetryPay
                ])
                ->get();

        if(count($orderHs) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkDataEmpty($data)
    {
        if(count($data) <= 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function getActivePackageDataSortedWithLimit($limit)
    {
        $package = PackageH::
            join('agencies', 'package_h_s.agency_id', '=', 'agencies.agency_id')->
            select(
                'package_h_s.*',
                'agencies.agency_name',
                )->
            where('is_active', '1')->
            where('is_custom', '0')->
            where('qty', '>', '0')->
            orderBy('updated_at', 'desc')->
            orderby('package_h_s.package_price', 'asc')->
            orderBy('qty', 'desc')->
            limit($limit)->get();

        return $package;
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

                $packageH = $this->createPackageHAgency($request->package_code, $request->agency_id, $request->package_name, $request->description, $request->package_price, $request->qty, $request->total_days);

                foreach($request->details as $detail)
                {
                    $strStartDate = null;
                    $strEndDate = null;

                    if($this->checkValidDateOnPackageRequest($detail))
                    {
                        $strStartDate = $this->reformatDate($detail['start_dt']);
                        $strEndDate = $this->reformatDate($detail['end_dt']);
                    }

                    $packageD = $this->createPackageD($packageH->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);
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

    public function EditPackageAgency(EditPackageAgencyRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $packageH = $this->updatePackageHForAgency($request->package_h_id, $request->package_name, $request->description, $request->package_price, $request->qty, $request->total_days);

            $this->deleteRangePackageD($request->package_h_id);

            foreach($request->details as $detail)
            {
                $strStartDate = null;
                $strEndDate = null;

                if($this->checkValidDateOnPackageRequest($detail))
                {
                    $strStartDate = $this->reformatDate($detail['start_dt']);
                    $strEndDate = $this->reformatDate($detail['end_dt']);
                }

                $packageD = $this->createPackageD($request->package_h_id, $detail['ref_hotel_id'], $detail['ref_attraction_id'], $detail['ref_vehicle_id'], $strStartDate, $strEndDate);
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Package successfully updated'
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function DeactivatePackageAgency(PackageHIdRequest $request)
    {
        try
        {
            $packageH = $this->getPackageHById($request->package_h_id);

            if($packageH == null)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Package not found'
                ], 400);
            }

            if($this->checkPackageInOrder($request->package_h_id) == true)
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Package is in active order'
                ], 400);
            }

            DB::beginTransaction();

            $this->updateIsActivePackageH($request->package_h_id, false);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Package deactivated'
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
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

            $email = $this->getEmailByForeignId($request->agency_id, Constanta::$roleAgency);

            $customerName = $this->getCustomerByCustomerId($packageHCustom->customer_id)->customer_name;

            $this->sendEmailCustomPackageRequest($email, $customerName);

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

    public function GetCustomPackageByCustomerId(GetCustomPackageCustomerRequest $request)
    {
        try
        {
            $packageH = $this->getCustomPackageByCustomerIdAndStatus($request->customer_id, true, $request->custom_status);

            if($packageH != null)
            {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'Success',
                    'package' => $packageH
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Data not found',
                    'package' => '-'
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'package' => '-'
            ], 500);
        }
    }

    public function GetCustomPackageByAgencyId(GetCustomPackageAgencyRequest $request)
    {
        try
        {
            $packageH = $this->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, $request->custom_status);

            if($packageH != null)
            {
                return response()->json([
                    'status' => 'ok',
                    'message' => 'Success',
                    'package' => $packageH
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Data not found',
                    'package' => '-'
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'package' => '-'
            ], 500);
        }
    }

    public function GetNewCustomPackageByAgencyId(GetCustomPackageAgencyRequest $request)
    {
        $packageH = $this->getCustomPackageByAgencyIdAndStatus($request->agency_id, true, $request->custom_status);

        if($packageH != null)
        {
            return response()->json([
                'status' => 'ok',
                'message' => 'Success',
                'package' => $packageH
            ], 200);
        }
        else
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Data not found',
                'package' => '-'
            ], 400);
        }
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

            $packageH = $this->updatePackageH($request->package_h_id, Constanta::$customPackageStatApv, $request->new_price, $request->total_days);

            $packageHistoryH = $this->createPackageHistoryH($packageH->package_code, $packageH->agency_id, $packageH->package_name, true, $packageH->package_price, $packageH->total_days);

            $orderNo = $this->generateOrderNo();

            $orderH = $this->createOrderH($packageH->agency_id, $packageH->customer_id, $packageH->package_price, $orderNo, Constanta::$orderStatusApproved);

            $packageDs = $packageH->packageDs;

            foreach($packageDs as $packageD)
            {
                $packageHistoryD = $this->createPackageHistoryDForCustom($packageHistoryH->package_history_h_id, $packageD->ref_hotel_id, $packageD->ref_attraction_id, $packageD->ref_vehicle_id, $packageD->start_dt, $packageD->end_dt);

                $orderD = $this->createOrderDForCustomPackage($orderH->order_h_id, $packageD->package_h_id, $packageHistoryH->package_history_h_id, $packageD->ref_hotel_id, $packageD->ref_attraction_id, $packageD->ref_vehicle_id, $packageD->start_dt, $packageD->end_dt, 1);
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

    public function RejectCustomPackage(PackageHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $packageH = $this->getPackageHById($request->package_h_id);

            $this->updatePackageH($request->package_h_id, Constanta::$orderStatusRejected, 0, 0);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Custom package rejected'
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function GetActivePackageHByAgencyId(AgencyIdRequest $request)
    {
        $packageH = $this->getPackageByAgencyId($request->agency_id);

        if($this->checkPackageDataEmpty($packageH) == true)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'No active package for this agency',
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => 'ok',
                'message' => 'success',
                'data' => $packageH
            ]);
        }
    }

    public function GetPackageDataById(PackageHIdRequest $request)
    {
        $package = $this->getPackageHWithDById($request->package_h_id);

        if($package == null)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Data not found',
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => 'ok',
                'message' => 'success',
                'data' => $package
            ]);
        }

        return response()->json($package);
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

    public function GetAgencyPackagesHomepage()
    {
        $packages = $this->getActivePackageDataSortedWithLimit(Constanta::$homepageDataCount);

        if($this->checkDataEmpty($packages) == true)
        {
            return response()->json(
                [
                    'status' => "error",
                    'message' => "Data not found",
                    'data'=> []
                ]
                ,400
            );
        }
        else
        {
            return response()->json(
                [
                    'status' => "ok",
                    'message' => "Success",
                    'data'=> $packages
                ]
            , 200);
        }
    }
    #endregion
}
