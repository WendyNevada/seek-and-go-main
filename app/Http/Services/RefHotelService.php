<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefHotelInterface;
use App\Models\RefHotel;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use App\Models\RefPicture;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RefHotelService implements RefHotelInterface
{
    public function GetHotelById(GetRefHotelByIdRequest $request)
    {
        $hotel = RefHotel::where('ref_hotel_id', $request->ref_hotel_id)->first();

        $hotelPicture = RefPicture::where('ref_hotel_id', $request->ref_hotel_id)->first();

        if($hotel != null)
        {
            if($hotelPicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'hotel' => $hotel,
                    'picture_url' => $hotelPicture->image_url
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'hotel' => $hotel,
                    'picture_url' => "-"
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'hotel' => "-",
                'picture_url' => "-"
            ], 400);
        }
    }

    public function AddHotel(StoreRefHotelRequest $request)
    {
        try
        {
            $hotelCheck = RefHotel::where('hotel_code', $request->hotel_code)->first();

            if($hotelCheck == null)
            {
                DB::beginTransaction();

                $hotel = RefHotel::
                create(
                    [
                        'hotel_code' => $request->hotel_code,
                        'ref_zipcode_id' => $request->ref_zipcode_id,
                        'hotel_name' => $request->hotel_name,
                        'description' => $request->description,
                        'address' => $request->address,
                        'rating' => $request->rating,
                        'is_active' => $request->is_active,
                        'qty' => $request->qty,
                        'promo_code' => $request->promo_code
                    ]
                );

                $refHotelId = $hotel->ref_hotel_id;

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $request->hotel_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refHotelPictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = new RefPicture();
                    $refPicture->ref_hotel_id = $refHotelId;
                    $refPicture->image_url = $url;
                    $refPicture->save();
                }

                $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_hotel_id' => $refHotelId,
                        'agency_id' => $request->agency_id,
                        'base_price' => $request->base_price,
                        'promo_code' => $request->promo_code_affiliate
                    ]
                );

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'ref_hotel_id' => $refHotelId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "data already exist",
                    'ref_hotel_id' => "-"
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_hotel_id' => "-"
            ], 500);
        }
    }

    public function EditHotelById(UpdateRefHotelRequest $request)
    {
        try
        {
            $hotel = RefHotel::where('ref_hotel_id', $request->ref_hotel_id)->first();

            if($hotel != null)
            {
                DB::beginTransaction();

                $hotel = $hotel->update([
                    'ref_zipcode_id' => $request->ref_zipcode_id,
                    'hotel_name' => $request->hotel_name,
                    'description' => $request->description,
                    'address' => $request->address,
                    'is_active' => $request->is_active,
                    'qty' => $request->qty,
                    'promo_code' => $request->promo_code
                ]);

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $hotel->hotel_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refHotelPictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = RefPicture::where('ref_hotel_id', $hotel->ref_hotel_id)->first();
                    if($refPicture != null)
                    {
                        $refPicture->image_url = $url;
                        $refPicture->save();
                    }
                    else
                    {
                        $refPicture = new RefPicture();
                        $refPicture->ref_hotel_id = $hotel->ref_hotel_id;
                        $refPicture->image_url = $url;
                        $refPicture->save();
                    }
                }

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'ref_hotel_id' => $request->ref_hotel_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "data not found",
                    'ref_hotel_id' => "-"
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_hotel_id' => "-"
            ], 500);
        }
    }

    public function GetHotelHomepage()
    {
        $hotel = RefHotel::orderBy('rating', 'desc')->limit(Constanta::$homepageDataCount)->get();

        foreach ($hotel as $key => $value)
        {
            $picture = RefPicture::where('ref_hotel_id', $value->ref_hotel_id)->first();

            if($picture != null)
            {
                $image_url = $picture->image_url;
            }
            else
            {
                $image_url = "-";
            }

            $value->image_url = $image_url;
        }

        return response()->json($hotel);
    }

    
}