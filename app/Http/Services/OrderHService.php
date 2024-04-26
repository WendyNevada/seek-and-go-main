<?php

namespace App\Http\Services;

use Carbon\Carbon;
use App\Models\Trx;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\Constanta;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\V2\CustIdRequest;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHService implements OrderHInterface
{

    #region Private Function

    private function getOrderHById($id)
    {
        $orderH = OrderH::where('order_h_id', $id)->first();
        return $orderH;
    }

    private function getOrderByAgencyAndStatusAndLimit($agency_id, $order_status)
    {
        $order = OrderH::where([
            ['agency_id', $agency_id],
            ['order_status', $order_status]
        ])->with('orderDs')->orderBy('order_dt', 'asc')->get();
        
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
        $order = OrderH::where('order_h_id', $order_h_id)->with('orderDs')->get();

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

        $orderD->package_history_id = $orderD->package_h_id == null ? null : 
            PackageHistoryH::where('package_code', 
                (PackageH::where('package_h_id', $orderD->package_h_id)->first()->package_code)
            )->first()->package_history_h_id;
        
        $orderD->ref_hotel_id = $ref_hotel_id == "" ? null : $ref_hotel_id;
        $orderD->ref_attraction_id = $ref_attraction_id == "" ? null : $ref_attraction_id;
        $orderD->ref_vehicle_id = $ref_vehicle_id == "" ? null : $ref_vehicle_id;
        $orderD->start_dt = $strStartDate;
        $orderD->end_dt = $strEndDate;
        $orderD->price = $price;
        $orderD->save();

        return $orderD;
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

    #endregion

    #region Public Function
    public function GetNewOrderDashboard(GetOrderDashboardRequest $request)
    {
        $order = $this->getOrderByAgencyAndStatusAndLimit($request->agency_id, Constanta::$orderStatusNew);
        
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
        $order = $this->getOrderByAgencyAndStatusAndLimit($request->agency_id, Constanta::$orderStatusCustPaid);
        
        return response()->json($order);
    }

    public function GetStatsForOrder(AgencyIdRequest $request)
    {
        $orderH = $this->getOrderStatusWithCountByAgencyId($request->agency_id);

        return response()->json($orderH);
    }

    #endregion

    
}