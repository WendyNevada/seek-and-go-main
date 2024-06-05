<?php

namespace App\Http\Services;

use App\Models\Trx;
use App\Models\OrderH;
use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use Illuminate\Support\Facades\DB;
use App\Http\Interfaces\TrxInterface;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CustPaymentRequest;
use App\Http\Requests\V2\RateProductRequest;

class TrxService implements TrxInterface
{
    #region Private Function
    private function getTrxByOrderId($order_h_id)
    {
        $trx = Trx::where('order_h_id', $order_h_id)->first();
        return $trx;
    }

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

    private function getRefAttractionById($ref_attraction_id)
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        return $attraction;
    }

    private function getRefHotelById($ref_hotel_id)
    {
        $hotel = RefHotel::where('ref_hotel_id', $ref_hotel_id)->first();

        return $hotel;
    }

    private function getRefVehicleById($ref_vehicle_id)
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        return $vehicle;
    }

    private function updateRatingAttraction($ref_attraction_id, $rating): void
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        $attraction->update([
            'rating' => $rating
        ]);
    }

    private function updateRatingHotel($ref_hotel_id, $rating): void
    {
        $hotel = RefHotel::where('ref_hotel_id', $ref_hotel_id)->first();

        $hotel->update([
            'rating' => $rating
        ]);
    }

    private function updateRatingVehicle($ref_vehicle_id, $rating): void
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        $vehicle->update([
            'rating' => $rating
        ]);
    }

    private function getAverage($numbers)
    {
        $sum = array_sum($numbers);
        $count = count($numbers);
        return $sum / $count;
    }

    private function updateIsRatingTrx($order_h_id, $status): void
    {
        Trx::where('order_h_id', $order_h_id)->
        update([
            'is_given_rating' => $status
        ]);
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

    public function GetTrxByOrderHId(OrderHIdRequest $request)
    {
        $trx = $this->getTrxByOrderId($request->order_h_id);

        if($trx == null)
        {
            return response()->json([
                'status' => 'error',
                'message' => 'Trx not found',
                'trx' => "-"
            ], 200);
        }
        else
        {
            return response()->json([
                'status' => 'ok',
                'message' => 'Trx found',
                'trx' => $trx
            ], 200);
        }
    }

    public function RateProduct(RateProductRequest $request)
    {
        try
        {
            DB::beginTransaction();

            if($request->product_type == Constanta::$attraction)
            {
                $attraction = $this->getRefAttractionById($request->id);

                if($attraction->rating != null)
                {
                    $ratingAvg = $this->getAverage([$attraction->rating, $request->rating]);
                    
                    $this->updateRatingAttraction($request->id, $ratingAvg);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Attraction has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
                else
                { 
                    $this->updateRatingAttraction($request->id, $request->rating);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Attraction has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
            }
            else if($request->product_type == Constanta::$hotel)
            {
                $hotel = $this->getRefHotelById($request->id);

                if($hotel->rating != null)
                {
                    $ratingAvg = $this->getAverage([$hotel->rating, $request->rating]);
                    
                    $this->updateRatingHotel($request->id, $ratingAvg);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Hotel has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
                else
                { 
                    $this->updateRatingHotel($request->id, $request->rating);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Hotel has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
            }
            else if($request->product_type == Constanta::$vehicle)
            {
                $vehicle = $this->getRefVehicleById($request->id);

                if($vehicle->rating != null)
                {
                    $ratingAvg = $this->getAverage([$vehicle->rating, $request->rating]);
                    
                    $this->updateRatingVehicle($request->id, $ratingAvg);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Vehicle has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
                else
                { 
                    $this->updateRatingVehicle($request->id, $request->rating);

                    $this->updateIsRatingTrx($request->order_h_id, true);

                    DB::commit();

                    return response()->json([
                        'status' => "ok",
                        'message' => "Vehicle has been rated",
                        'product_type' => $request->product_type,
                        'id' => $request->id
                    ], 200);
                }
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'product_type' => $request->product_type,
                'id' => $request->id
            ], 500);
        }
    }
    #endregion
    
}