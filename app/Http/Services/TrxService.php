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
    #region Private Function
    private function updateOrderHStatus($order_h_id, $order_status)
    {
        $orderH = OrderH::where('order_h_id', $order_h_id)->first();
        $orderH->order_status = $order_status;
        $orderH->update();

        return $orderH;
    }

    private function insertRefPictureOrder($picture, $order_no, $order_h_id)
    {
        $image = $picture;
        $imageName =  $order_no . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$orderHPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = new RefPicture();
        $refPicture->order_h_id = $order_h_id;
        $refPicture->image_url = $url;
        $refPicture->save();
    }
    #endregion

    #region Public Function
    public function CustPayment(CustPaymentRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $orderH = $this->updateOrderHStatus($request->order_h_id, Constanta::$orderStatusCustPaid);

            if($request->hasFile('picture'))
            {
                $this->insertRefPictureOrder($request->file('picture'), $orderH->order_no, $orderH->order_h_id);
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

            $orderH = $this->updateOrderHStatus($request->order_h_id, Constanta::$orderStatusCanceled);

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
    #endregion
    
}