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
use Brick\Math\BigInteger;

class RefHotelService implements RefHotelInterface
{
    #region Private Function
    private function getRefHotelByCode($hotel_code)
    {
        $hotel = RefHotel::where('hotel_code', $hotel_code)->first();

        return $hotel;
    }

    private function getRefHotelById($ref_hotel_id)
    {
        $hotel = RefHotel::where('ref_hotel_id', $ref_hotel_id)->first();

        return $hotel;
    }

    private function getRefPictureByHotelId($ref_hotel_id)
    {
        $hotelPicture = RefPicture::where('ref_hotel_id', $ref_hotel_id)->first();

        return $hotelPicture;
    }

    private function getAgencyAffiliateByHotelId($ref_hotel_id)
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_hotel_id', $ref_hotel_id)->first();

        return $agencyAffiliate;
    }

    private function getRefZipcodeById($ref_zipcode_id)
    {
        $refZipcode = RefZipcode::where('ref_zipcode_id', $ref_zipcode_id)->first();

        return $refZipcode;
    }

    private function getRefZipcodeIdByAllArea($area_1, $area_2, $area_3, $area_4)
    {
        $refZipcodeId = RefZipcode::
                    where('area_1', $area_1)->
                    where('area_2', $area_2)->
                    where('area_3', $area_3)->
                    where('area_4', $area_4)->
                    first()->ref_zipcode_id;

        return $refZipcodeId;
    }

    private function createRefHotel($hotel_code, $refZipcodeId, $hotel_name, $description, $address, $rating, $qty, $promo_code): RefHotel
    {
        $hotel = RefHotel::
                create(
                    [
                        'hotel_code' => $hotel_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'hotel_name' => $hotel_name,
                        'description' => $description,
                        'address' => $address,
                        'rating' => $rating,
                        'is_active' => true,
                        'qty' => $qty,
                        'promo_code' => $promo_code
                    ]
                );

        return $hotel;
    }

    private function insertRefPictureHotel($picture, $hotel_code, $ref_hotel_id): void
    {
        $image = $picture;
        $imageName =  $hotel_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refHotelPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = new RefPicture();
        $refPicture->ref_hotel_id = $ref_hotel_id;
        $refPicture->image_url = $url;
        $refPicture->save();
    }

    private function insertAgencyAffiliateHotel($ref_hotel_id, $agency_id, $base_price, $promo_code_affiliate): void
    {
        $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_hotel_id' => $ref_hotel_id,
                        'agency_id' => $agency_id,
                        'base_price' => $base_price,
                        'promo_code' => $promo_code_affiliate
                    ]
                );
    }

    private function updatePriceAgencyAffiliateHotel($ref_hotel_id, $base_price): void
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_hotel_id', $ref_hotel_id)->first();

        $agencyAffiliate->update(
            [
                'base_price' => $base_price
            ]
        );
    }

    private function updateRefHotel($hotel, $hotel_name, $description, $address, $qty, $promo_code): void
    {
        $hotel->update([
            'hotel_name' => $hotel_name,
            'description' => $description,
            'address' => $address,
            'qty' => $qty,
            'promo_code' => $promo_code
        ]);
    }

    private function updateRefPictureHotel($picture, $hotel_code, $ref_hotel_id)
    {
        $image = $picture;
        $imageName =  $hotel_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refHotelPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = RefPicture::where('ref_hotel_id', $ref_hotel_id)->first();
        if($refPicture != null)
        {
            $refPicture->image_url = $url;
            $refPicture->save();
        }
        else
        {
            $refPicture = new RefPicture();
            $refPicture->ref_attraction_id = $ref_hotel_id;
            $refPicture->image_url = $url;
            $refPicture->save();
        }
    }

    private function checkOrderForHotel($ref_hotel_id): bool
    {
        $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($ref_hotel_id) {
                    $query->where('ref_hotel_id', $ref_hotel_id);
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
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkPackageForHotel($ref_hotel_id): bool
    {
        $packageHs = PackageH::with('packageDs')
                ->whereHas('packageDs', function ($query) use ($ref_hotel_id) {
                    $query->where('ref_hotel_id', $ref_hotel_id);
                })
                ->where('is_active', true)
                ->get();

        if(count($packageHs) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function updateIsActiveHotel($ref_hotel_id, $status): void
    {
        $hotel = RefHotel::where('ref_hotel_id', $ref_hotel_id)->first();

        $hotel->update([
            'is_active' => $status
        ]);
    }

    private function getActiveHotelDataSortedWithLimit($limit)
    {
        $hotel = RefHotel::where('is_active', '1')->orderBy('rating', 'desc')->limit($limit)->get();

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

        return $hotel;
    }

    private function getActiveHotelsByAgencyId($agency_id, $limit)
    {
        $hotel = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        leftjoin('ref_pictures', 'ref_hotels.ref_hotel_id', '=', 'ref_pictures.ref_hotel_id')->
        select('ref_hotels.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_hotels.is_active', true)->
        where('agency_affiliates.agency_id', $agency_id)->
        limit($limit)->
        get();

        return $hotel;
    }
    #endregion

    #region Public Function
    public function GetHotelById(GetRefHotelByIdRequest $request)
    {
        $hotel = $this->getRefHotelById($request->ref_hotel_id);

        $hotelPicture = $this->getRefPictureByHotelId($request->ref_hotel_id);

        $agencyAffiliate = $this->getAgencyAffiliateByHotelId($request->ref_hotel_id);

        $address = $this->getRefZipcodeById($hotel->ref_zipcode_id);

        if($hotel != null)
        {
            if($hotelPicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'hotel' => $hotel,
                    'picture_url' => $hotelPicture->image_url,
                    'base_price' => $agencyAffiliate->base_price,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'hotel' => $hotel,
                    'picture_url' => "-",
                    'base_price' => $agencyAffiliate->base_price,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
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
                'base_price' => "-",
                'address' => "-"
            ], 400);
        }
    }

    public function AddHotel(StoreRefHotelRequest $request)
    {
        try
        {
            $hotelCheck = $this->getRefHotelByCode($request->hotel_code);

            if($hotelCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = $this->getRefZipcodeIdByAllArea($request->area_1, $request->area_2, $request->area_3, $request->area_4);

                $hotel = $this->createRefHotel(
                    $request->hotel_code,
                    $refZipcodeId,
                    $request->hotel_name,
                    $request->description,
                    $request->address,
                    $request->rating,
                    $request->qty,
                    $request->promo_code
                );

                $refHotelId = $hotel->ref_hotel_id;

                if($request->hasFile('picture'))
                {
                    $this->insertRefPictureHotel($request->file('picture'), $request->hotel_code, $refHotelId);
                }

                $affiliate = $this->insertAgencyAffiliateHotel($refHotelId, $request->agency_id, $request->base_price, $request->promo_code_affiliate); 

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
            $hotel = $this->getRefHotelById($request->ref_hotel_id);

            if($hotel != null)
            {
                DB::beginTransaction();

                $this->updatePriceAgencyAffiliateHotel($request->ref_hotel_id, $request->base_price);

                $this->updateRefHotel($request->ref_hotel_id, $request->hotel_name, $request->description, $request->address, $request->qty, $request->promo_code);

                if($request->picture_url == null)
                {
                    if($request->hasFile('picture'))
                    {
                        $this->updateRefPictureHotel($request->file('picture'), $request->hotel_code, $request->ref_hotel_id);
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
                $orderHs = $this->checkOrderForHotel($request->ref_hotel_id);

                if($orderHs == true)
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

                $packageHs = $this->checkPackageForHotel($request->ref_hotel_id);

                if($packageHs == true)
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

                $this->updateIsActiveHotel($request->ref_hotel_id, false);

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
        $hotel = $this->getActiveHotelDataSortedWithLimit(Constanta::$homepageDataCount);

        return response()->json($hotel);
    }

    public function GetActiveHotelByAgencyId(AgencyIdRequest $request)
    {
        $hotel = $this->getActiveHotelsByAgencyId($request->agency_id, Constanta::$homepageDataCount);

        return response()->json($hotel);
    }
    #endregion
    
}