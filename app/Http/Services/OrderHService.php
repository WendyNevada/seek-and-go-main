<?php

namespace App\Http\Services;

use Carbon\Carbon;
use App\Models\Trx;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use App\Models\PackageHistoryD;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\V2\CustIdRequest;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetCustomerOrderRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHService implements OrderHInterface
{

    #region Private Function

    private function getOrderHById($id)
    {
        $orderH = OrderH::where('order_h_id', $id)->first();
        return $orderH;
    }

    private function getOrderByAgencyAndStatus($agency_id, $order_status)
    {
        if($order_status == 'ALL')
        {
            $order = OrderH::where([
                ['agency_id', $agency_id]
            ])->orderBy('order_dt', 'asc')->get();
        }
        else
        {
            $order = OrderH::where([
                ['agency_id', $agency_id],
                ['order_status', $order_status]
            ])->orderBy('order_dt', 'asc')->get();
        }
        
        return $order;
    }

    private function getOrderByCustomerAndStatusWithLimit($customer_id, $order_status, $limit = null)
    {
        if($limit != null)
        {
            $order = OrderH::where([
                ['customer_id', $customer_id],
                ['order_status', $order_status]
            ])->with('orderDs')->orderBy('order_dt', 'asc')->limit($limit)->get();
        }
        else
        {
            $order = OrderH::where([
                ['customer_id', $customer_id],
                ['order_status', $order_status]
            ])->with('orderDs')->orderBy('order_dt', 'asc')->get();
        }

        return $order;
    }

    private function getOrderHByIdWithOrderD($order_h_id)
    {
        $order = OrderH::where('order_h_id', $order_h_id)->with('orderDs')->first();

        return $order;
    }

    private function generateOrderNo(): string
    {
        $orderNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

        return $orderNo;
    }

    private function createNewOrderH($order_no, $customer_id, $agency_id): OrderH
    {
        $orderH = new OrderH();
        $orderH->agency_id = $agency_id;
        $orderH->customer_id = $customer_id;
        $orderH->order_dt = now();
        $orderH->total_price = 0;
        $orderH->order_no = $order_no;
        $orderH->order_status = Constanta::$orderStatusNew;
        $orderH->save();

        return $orderH;
    }

    private function updateOrderTotalPrice($order_h_id, $total_price)
    {
        $orderH = OrderH::find($order_h_id);
        $orderH->total_price = $total_price;
        $orderH->save();
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

    private function createOrderD($order_h_id, $package_h_id, $ref_hotel_id, $ref_attraction_id, $ref_vehicle_id, $strStartDate, $strEndDate, $price): OrderD
    {
        $orderD = new OrderD();
        $orderD->order_h_id = $order_h_id;
        $orderD->package_h_id = $package_h_id;
        $orderD->package_history_id = null;
        $orderD->ref_hotel_id = $ref_hotel_id == null ? null : $ref_hotel_id;
        $orderD->ref_attraction_id = $ref_attraction_id == null ? null : $ref_attraction_id;
        $orderD->ref_vehicle_id = $ref_vehicle_id == null ? null : $ref_vehicle_id;
        $orderD->start_dt = $strStartDate;
        $orderD->end_dt = $strEndDate;
        $orderD->price = $price;
        $orderD->save();

        return $orderD;
    }

    private function updateOrderDPackageHistoryByOrderHId($order_h_id, $package_history_h_id)
    {
        OrderD::where('order_h_id', $order_h_id)
            ->update(['package_history_id' => $package_history_h_id]);
    }

    private function updateOrderStatus($order_h_id, $order_status): OrderH
    {
        $orderH = OrderH::where('order_h_id', $order_h_id)->first();
        $orderH->order_status = $order_status;
        $orderH->update();

        return $orderH;
    }

    private function generateTrxNo(): string
    {
        $trxNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

        return $trxNo;
    }

    private function createTrx($trxNo, $order_h_id): Trx
    {
        $trx = new Trx();
        $trx->trx_no = $trxNo;
        $trx->order_h_id = $order_h_id;
        $trx->payment_status = false;
        $trx->save();

        return $trx;
    }

    private function updatePaymentStatusTrx($order_h_id, $payment_status): Trx
    {
        $trx = Trx::where('order_h_id', $order_h_id)->first();
        $trx->payment_status = $payment_status;
        $trx->update();

        return $trx;
    }

    private function getTotalDays($dateEnd, $dateStart)
    {
        $dateEnd = Carbon::parse($dateEnd);
        $dateStart = Carbon::parse($dateStart);

        $diffInDays = $dateEnd->diffInDays($dateStart);

        return $diffInDays;
    }

    private function getTotalPrice($price, $days)
    {
        $totalPrice = $price * $days;

        return $totalPrice;
    }

    private function getPackageInsideOrder($order_h_id)
    {
        $packageHIds = OrderD::where('order_h_id', $order_h_id)->
        where('package_h_id', '!=', null)->
        distinct()->
        select('package_h_id')->get();

        return $packageHIds;
    }

    private function getPackagePrice($package_h_id)
    {
        $price = PackageH::where('package_h_id', $package_h_id)->first()->package_price;

        return $price;
    }

    private function getOrderStatusWithCountByAgencyId($agency_id)
    {
        $order = OrderH::where('agency_id', $agency_id)->
        select('order_status', DB::raw('count(order_h_id) as total'))->
        groupby('order_status')->
        get();
        return $order;
    }

    private function getPackageHById($package_h_id)
    {
        $packageH = PackageH::where('package_h_id', $package_h_id)->first();
        return $packageH;
    }

    private function generatePackageCodePerOrder($package_code, $order_no)
    {
        $packageCode = $package_code . $order_no;
        return $packageCode;
    }

    private function createPackageHistoryH($package_code, $agency_id, $package_name, $is_custom, $package_price, $total_days)
    {
        Log::info('total days = ' . $total_days);

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

    private function createPackageHistoryD($package_history_h_id, $packageD)
    {
        foreach ($packageD as $item) {
            $packageHistoryD = PackageHistoryD::create([
                'package_history_h_id' => $package_history_h_id,

                'hotel_name' => $item->ref_hotel_id == null ? null : RefHotel::where('ref_hotel_id', $item->ref_hotel_id)->first()->hotel_name,
                'hotel_start_dt' => $item->ref_hotel_id == null ? null : $item->start_dt,
                'hotel_end_dt' => $item->ref_hotel_id == null ? null : $item->end_dt,

                'attraction_name' => $item->ref_attraction_id == null ? null : RefAttraction::where('ref_attraction_id', $item->ref_attraction_id)->first()->attraction_name,
                'attraction_start_dt' => $item->ref_attraction_id == null ? null : $item->start_dt,
                'attraction_end_dt' => $item->ref_attraction_id == null ? null : $item->end_dt,

                'vehicle_name' => $item->ref_vehicle_id == null ? null : RefVehicle::where('ref_vehicle_id', $item->ref_vehicle_id)->first()->vehicle_name,
                'vehicle_start_dt' => $item->ref_vehicle_id == null ? null : $item->start_dt,
                'vehicle_end_dt' => $item->ref_vehicle_id == null ? null : $item->end_dt
            ]);
        }
    }
    #endregion

    #region Public Function
    public function GetNewOrderDashboard(GetOrderDashboardRequest $request)
    {
        $order = $this->getOrderByAgencyAndStatus($request->agency_id, Constanta::$orderStatusNew);
        
        return response()->json($order);
    }

    public function GetNewOrderForCustomer(CustIdRequest $request)
    {
        $order = $this->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusNew);
        
        return response()->json($order);
    }

    public function GetApvOrderForCustomer(CustIdRequest $request)
    {
        $order = $this->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusApproved);
        
        return response()->json($order);
    }

    public function GetRetryPayOrderForCustomer(CustIdRequest $request)
    {
        $order = $this->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusRetryPay);
        
        return response()->json($order);
    }

    public function GetCustomerOrderByIdAndStatus(GetCustomerOrderRequest $request)
    {
        $order = $this->getOrderByCustomerAndStatusWithLimit($request->customer_id, $request->order_status);
        
        return response()->json($order);
    }

    public function GetOrderById(GetOrderByIdRequest $request)
    {
        $order = $this->getOrderHByIdWithOrderD($request->order_h_id);
        
        return response()->json($order);
    }

    public function CreateOrder(CreateOrderRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderNo = $this->generateOrderNo();

            $orderH = $this->createNewOrderH($orderNo, $request->customer_id, $request->agency_id);

            $totPrice = 0;

            foreach($request->details as $detail)
            {
                $strStartDate = $this->reformatDate($detail['start_dt']);
                $strEndDate = $this->reformatDate($detail['end_dt']);

                $price = $detail['price'];

                if($detail['package_h_id'] == null)
                {
                    $totDays = $this->getTotalDays($strEndDate, $strStartDate);
                    $price = $this->getTotalPrice($detail['price'], $totDays);
                }

                $orderD = $this->createOrderD(
                    $orderH->order_h_id,
                    $detail['package_h_id'],
                    $detail['ref_hotel_id'],
                    $detail['ref_attraction_id'],
                    $detail['ref_vehicle_id'],
                    $strStartDate,
                    $strEndDate,
                    $price
                );

                if($detail['package_h_id'] == null)
                {   
                    $totPrice += $price;
                }
            }

            $packageIds = $this->getPackageInsideOrder($orderH->order_h_id);

            if(count($packageIds) > 0)
            {
                foreach($packageIds as $packageId)
                {
                    $packageH = $this->getPackageHById($packageId->package_h_id);
                    
                    $packageCodePerOrder = $this->generatePackageCodePerOrder($packageH->package_code, $orderNo);

                    $packageHistH = $this->createPackageHistoryH($packageCodePerOrder, $packageH->agency_id, $packageH->package_name, $packageH->is_custom, $packageH->package_price, $packageH->total_days);

                    $this->createPackageHistoryD($packageHistH->package_history_h_id, $packageH->packageDs);

                    $this->updateOrderDPackageHistoryByOrderHId($orderH->order_h_id, $packageHistH->package_history_h_id);

                    $totPrice += $this->getPackagePrice($packageId->package_h_id);
                }

                $this->updateOrderTotalPrice($orderH->order_h_id, $totPrice);
            }
            else
            {
                $this->updateOrderTotalPrice($orderH->order_h_id, $totPrice);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order created successfully',
                'order_h_id' => $orderH->order_h_id,
                'order_no' => $orderH->order_no
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_h_id' => "-",
                'order_no' => "-"
            ], 500);
        }
    }

    public function ApproveOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusApproved);

            $trxNo = $this->generateTrxNo();

            $trx = $this->createTrx($trxNo, $request->order_h_id);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order approved successfully',
                'trx_no' => $trxNo
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

    public function RejectOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();
            
            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusRejected);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order rejected',
                'order_no' => $orderH->order_no
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_no' => $orderH->order_no
            ], 500);
        }
    }

    public function CancelOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusCanceled);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order canceled',
                'order_no' => $orderH->order_no
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_no' => $orderH->order_no
            ], 500);
        }
    }

    public function PaidOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusPaid);

            $trx = $this->updatePaymentStatusTrx($request->order_h_id, true);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order payment accepted',
                'order_no' => $orderH->order_no
            ], 200);

        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_no' => $orderH->order_no
            ], 500);

        }
    }

    public function FinishOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusFinished);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order completed',
                'order_no' => $orderH->order_no
            ], 200);

        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_no' => $orderH->order_no
            ], 500);

        }
    }

    public function RetryPaymentOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderStatus($request->order_h_id, Constanta::$orderStatusRetryPay);

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Order set to retry payment',
                'order_no' => $orderH->order_no
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'order_no' => $orderH->order_no
            ], 500);
        }
    }

    public function GetCustPaidOrder(GetOrderDashboardRequest $request)
    {
        $order = $this->getOrderByAgencyAndStatus($request->agency_id, Constanta::$orderStatusCustPaid);
        
        return response()->json($order);
    }

    public function GetStatsForOrder(AgencyIdRequest $request)
    {
        $orderH = $this->getOrderStatusWithCountByAgencyId($request->agency_id);

        return response()->json($orderH);
    }

    public function GetOrderDashboardByAgencyIdAndStatus(GetOrderDashboardRequest $request)
    {
        $order = $this->getOrderByAgencyAndStatus($request->agency_id, $request->status);
        
        return response()->json($order);
    }

    #endregion

    
}