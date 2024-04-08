<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefHotel;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use Illuminate\Support\Facades\DB;

class RefHotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRefHotelRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefHotel $refHotel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefHotel $refHotel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefHotelRequest $request, RefHotel $refHotel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefHotel $refHotel)
    {
        //
    }

    public function GetHotelById(GetRefHotelByIdRequest $request)
    {
        $hotel = RefHotel::where('ref_hotel_id', $request->ref_hotel_id)->first();
		return response()->json($hotel);
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
        $hotel = RefHotel::orderBy('rating', 'desc')->get()->take(Constanta::$homepageDataCount);
        return response()->json($hotel);
    }
}
