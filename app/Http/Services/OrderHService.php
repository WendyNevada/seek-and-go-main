<?php

namespace App\Http\Services;

use App\Models\Trx;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\Constanta;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\CustIdRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHService implements OrderHInterface
{

    #region Private Function

    private function getOrderByAgencyAndStatusAndLimit($agency_id, $order_status, $limit)
    {
        $order = OrderH::where([
            ['agency_id', $agency_id],
            ['order_status', $order_status]
        ])->with('orderDs')->orderBy('order_dt', 'asc')->limit($limit)->get();
        
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

    #endregion

    #region Public Function
    public function GetNewOrderDashboard(GetOrderDashboardRequest $request)
    {
        $orderHService = new OrderHService;

        $order = $orderHService->getOrderByAgencyAndStatusAndLimit($request->agency_id, Constanta::$orderStatusNew, Constanta::$orderDashboardDataCount);
        
        return response()->json($order);
    }

    public function GetNewOrderForCustomer(CustIdRequest $request)
    {
        $orderHService = new OrderHService;

        $order = $orderHService->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusNew);
        
        return response()->json($order);
    }

    public function GetApvOrderForCustomer(CustIdRequest $request)
    {
        $orderHService = new OrderHService;

        $order = $orderHService->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusApproved);
        
        return response()->json($order);
    }

    public function GetRetryPayOrderForCustomer(CustIdRequest $request)
    {
        $orderHService = new OrderHService;

        $order = $orderHService->getOrderByCustomerAndStatusWithLimit($request->customer_id, Constanta::$orderStatusRetryPay, Constanta::$orderDashboardDataCount);
        
        return response()->json($order);
    }

    public function GetOrderById(GetOrderByIdRequest $request)
    {
        $orderHService = new OrderHService;

        $order = $orderHService->getOrderHByIdWithOrderD($request->order_h_id);
        
        return response()->json($order);
    }

    public function CreateOrder(CreateOrderRequest $request)
    {
        
        try
        {
            DB::beginTransaction();

            $orderNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

            $orderH = new OrderH();
            $orderH->agency_id = $request->agency_id;
            $orderH->customer_id = $request->customer_id;
            $orderH->order_dt = now();
            $orderH->total_price = $request->total_price;
            $orderH->order_no = $orderNo;
            $orderH->order_status = Constanta::$orderStatusNew;
            $orderH->save();

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

                $orderD = new OrderD();
                $orderD->order_h_id = $orderH->order_h_id;
                $orderD->package_h_id = $detail['package_h_id'];

                $orderD->package_history_id = $orderD->package_h_id == null ? null : 
                    PackageHistoryH::where('package_code', 
                        (PackageH::where('package_h_id', $orderD->package_h_id)->first()->package_code)
                    )->first()->package_history_h_id;
                
                $orderD->ref_hotel_id = $detail['ref_hotel_id'] == "" ? null : $detail['ref_hotel_id'];
                $orderD->ref_attraction_id = $detail['ref_attraction_id'] == "" ? null : $detail['ref_attraction_id'];
                $orderD->ref_vehicle_id = $detail['ref_vehicle_id'] == "" ? null : $detail['ref_vehicle_id'];
                $orderD->start_dt = $strStartDate;
                $orderD->end_dt = $strEndDate;
                $orderD->price = $detail['price'];
                $orderD->save();
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

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusApproved;
            $orderH->update();

            $trxNo = Constanta::$orderConst . date("YmdHis") . rand(100, 999);

            $trx = new Trx();
            $trx->trx_no = $trxNo;
            $trx->order_h_id = $request->order_h_id;
            $trx->payment_status = false;
            $trx->save();

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

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusRejected;
            $orderH->update();

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

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusCanceled;
            $orderH->update();

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

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusPaid;
            $orderH->update();

            $trx = Trx::where('order_h_id', $request->order_h_id)->first();
            $trx->payment_status = true;
            $trx->update();

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

    public function RetryPaymentOrder(OrderHIdRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusRetryPay;
            $orderH->update();

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
        $order = OrderH::where([
            ['agency_id', $request->agency_id],
            ['order_status', Constanta::$orderStatusCustPaid]
        ])->with('orderDs')->orderBy('order_dt', 'asc')->limit(Constanta::$orderDashboardDataCount)->get();
        
        return response()->json($order);
    }

    #endregion

    
}