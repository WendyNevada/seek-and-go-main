<?php

namespace App\Http\Services;

use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Models\Constanta;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\PackageHistoryH;
use Illuminate\Support\Facades\DB;

class OrderHService implements OrderHInterface
{
    public function CreateOrder(CreateOrderRequest $request)
    {

        try
        {
            DB::beginTransaction();

            $orderNo = "ORD".date("YmdHis").rand(100, 999);

            $orderH = new OrderH();
            $orderH->agency_id = $request->agency_id;
            $orderH->customer_id = $request->customer_id;
            $orderH->order_dt = $request->order_dt;
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
}