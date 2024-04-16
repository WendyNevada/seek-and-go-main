<?php

namespace App\Http\Services;

use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\RefZipcode;
use App\Models\AgencyAffiliate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefHotelInterface;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;

class RefHotelService implements RefHotelInterface
{
    public function GetHotelById(GetRefHotelByIdRequest $request)
    {
        $hotel = RefHotel::where('ref_hotel_id', $request->ref_hotel_id)->first();

        $hotelPicture = RefPicture::where('ref_hotel_id', $request->ref_hotel_id)->first();

        $agencyAffiliate = AgencyAffiliate::where('ref_hotel_id', $request->ref_hotel_id)->first();

        if($hotel != null)
        {
            if($hotelPicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'hotel' => $hotel,
                    'picture_url' => $hotelPicture->image_url,
                    'base_price' => $agencyAffiliate->base_price
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'hotel' => $hotel,
                    'picture_url' => "-",
                    'base_price' => $agencyAffiliate->base_price
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'hotel' => "-",
                'picture_url' => "-",
                'base_price' => "-"
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

                $refZipcodeId = RefZipcode::
                    where('area_1', $request->area_1)->
                    where('area_2', $request->area_2)->
                    where('area_3', $request->area_3)->
                    where('area_4', $request->area_4)->
                    first()->ref_zipcode_id;

                $hotel = RefHotel::
                create(
                    [
                        'hotel_code' => $request->hotel_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'hotel_name' => $request->hotel_name,
                        'description' => $request->description,
                        'address' => $request->address,
                        'rating' => $request->rating,
                        'is_active' => true,
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
                    'message' => "Hotel added successfully",
                    'ref_hotel_id' => $refHotelId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Hotel code already exists",
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

                $refZipcodeId = RefZipcode::
                    where('area_1', $request->area_1)->
                    where('area_2', $request->area_2)->
                    where('area_3', $request->area_3)->
                    where('area_4', $request->area_4)->
                    first()->ref_zipcode_id;

                $agencyAffiliate = AgencyAffiliate::where('ref_hotel_id', $hotel->ref_hotel_id)->first();

                $agencyAffiliate->update(
                    [
                        'base_price' => $request->base_price
                    ]
                );

                $hotel = $hotel->update([
                    'ref_zipcode_id' => $refZipcodeId,
                    'hotel_name' => $request->hotel_name,
                    'description' => $request->description,
                    'address' => $request->address,
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
                    'message' => "Hotel edited successfully",
                    'ref_hotel_id' => $request->ref_hotel_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Data not found",
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

    public function DeactivateHotelById(RefHotelIdRequest $request)
    {
        try
        {
            $hotel = RefHotel::where('ref_hotel_id', $request->ref_hotel_id)->first();

            if($hotel != null)
            {
                $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($request) {
                    $query->where('ref_hotel_id', $request->ref_hotel_id);
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
                    return response()->json(
                        [
                            'status' => "error",
                            'message' => "Hotel is in active order",
                            'ref_hotel_id' => $request->ref_hotel_id
                        ],
                        400
                    );
                }

                $packageHs = PackageH::with('packageDs')
                ->whereHas('packageDs', function ($query) use ($request) {
                    $query->where('ref_hotel_id', $request->ref_hotel_id);
                })
                ->where('is_active', true)
                ->get();

                if(count($packageHs) > 0)
                {
                    return response()->json(
                        [
                            'status' => "error",
                            'message' => "Hotel is in active package",
                            'ref_hotel_id' => $request->ref_hotel_id
                        ],
                        400
                    );
                }

                DB::beginTransaction();

                $hotel->update(
                    [
                        'is_active' => '0'
                    ]
                );

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Deactivate success",
                    'ref_hotel_id' => $request->ref_hotel_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Data not found",
                    'ref_hotel_id' => $request->ref_hotel_id
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
        $hotel = RefHotel::where('is_active', '1')->orderBy('rating', 'desc')->limit(Constanta::$homepageDataCount)->get();

        foreach ($hotel as $key => $value)
        {
            $picture = RefPicture::where('ref_hotel_id', $value->ref_hotel_id)->first();

            $base_price = AgencyAffiliate::where('ref_hotel_id', $value->ref_hotel_id)->first()->base_price;

            if($picture != null)
            {
                $image_url = $picture->image_url;
            }
            else
            {
                $image_url = "-";
            }

            $value->image_url = $image_url;
            $value->base_price = $base_price;
        }

        return response()->json($hotel);
    }

    public function GetActiveHotelByAgencyId(AgencyIdRequest $request)
    {
        $hotel = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        leftjoin('ref_pictures', 'ref_hotels.ref_hotel_id', '=', 'ref_pictures.ref_hotel_id')->
        select('ref_hotels.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_hotels.is_active', true)->
        where('agency_affiliates.agency_id', $request->agency_id)->
        limit(Constanta::$homepageDataCount)->
        get();

        return response()->json($hotel);
    }
    
}