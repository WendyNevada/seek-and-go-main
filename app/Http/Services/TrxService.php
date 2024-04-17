<?php

namespace App\Http\Services;

use App\Models\OrderH;
use App\Models\Constanta;
use App\Models\RefPicture;
use Illuminate\Support\Facades\DB;
use App\Http\Interfaces\TrxInterface;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\V2\CustPaymentRequest;
use App\Http\Requests\V2\OrderHIdRequest;

class TrxService implements TrxInterface
{
    public function CustPayment(CustPaymentRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = OrderH::where('order_h_id', $request->order_h_id)->first();
            $orderH->order_status = Constanta::$orderStatusCustPaid;
            $orderH->update();

            if($request->hasFile('picture'))
            {
                $image = $request->file('picture');
                $imageName =  $request->$orderH->order_no . '.' . $image->getClientOriginalName();
                $path = $image->storeAs(Constanta::$orderHPictureDirectory, $imageName, Constanta::$refPictureDisk);
                $url = Storage::url($path);

                $refPicture = new RefPicture();
                $refPicture->order_h_id = $orderH->order_h_id;
                $refPicture->image_url = $url;
                $refPicture->save();
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Payment confirmation sent to agency',
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

    public function CancelCustPayment(OrderHIdRequest $request)
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
                'message' => 'Payment for order canceled',
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

    
}