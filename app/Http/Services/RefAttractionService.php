<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefAttractionInterface;
use App\Models\RefAttraction;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\RefPicture;
use App\Models\RefZipcode;
use Brick\Math\BigInteger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RefAttractionService implements RefAttractionInterface
{
    #region Private Function
    private function getRefAttractionByCode($attraction_code)
    {
        $attraction = RefAttraction::where('attraction_code', $attraction_code)->first();

        return $attraction;
    }

    private function getRefAttractionById($ref_attraction_id)
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        return $attraction;
    }

    private function getRefPictureByAttractionId($ref_attraction_id)
    {
        $attractionPicture = RefPicture::where('ref_attraction_id', $ref_attraction_id)->first();

        return $attractionPicture;
    }

    private function getAgencyAffiliateByAttractionId($ref_attraction_id)
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $ref_attraction_id)->first();

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

    private function createRefAttraction($attraction_code, $refZipcodeId, $attraction_name, $description, $address, $rating, $qty) : RefAttraction
    {
        $attraction = RefAttraction::
                create(
                    [
                        'attraction_code' => $attraction_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'attraction_name' => $attraction_name,
                        'description' => $description,
                        'address' => $address,
                        'rating' => $rating,
                        'is_active' => true,
                        'qty' => $qty
                    ]
                );

        return $attraction;
    }

    private function insertRefPictureAttraction($picture, $attraction_code, $ref_attraction_id): void
    {
        $image = $picture;
        $imageName =  $attraction_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refAttractionPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = new RefPicture();

        $refPicture->ref_attraction_id = $ref_attraction_id;
        $refPicture->image_url = $url;
        $refPicture->save();
    }

    private function insertAgencyAffiliateAttraction($ref_attraction_id, $agency_id, $base_price, $promo_code): void
    {
        $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_attraction_id' => $ref_attraction_id,
                        'agency_id' => $agency_id,
                        'base_price' => $base_price,
                        'promo_code' => $promo_code
                    ]
                );
    }

    private function updateAgencyAffiliateAttraction($ref_attraction_id, $base_price, $promo_code): void
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $ref_attraction_id)->first();

        $agencyAffiliate->update(
            [
                'base_price' => $base_price,
                'promo_code' => $promo_code
            ]
        );
    }

    private function updateRefAttraction($ref_attraction_id, $attraction_name, $description, $address, $qty): void
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        $attraction->update([
            'attraction_name' => $attraction_name,
            'description' => $description,
            'address' => $address,
            'qty' => $qty
        ]);
    }

    private function updateRefPictureAttraction($picture, $attraction_code, $ref_attraction_id)
    {
        $image = $picture;
        $imageName =  $attraction_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refAttractionPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = RefPicture::where('ref_attraction_id', $ref_attraction_id)->first();
        if($refPicture != null)
        {
            $refPicture->image_url = $url;
            $refPicture->save();
        }
        else
        {
            $refPicture = new RefPicture();
            $refPicture->ref_attraction_id = $ref_attraction_id;
            $refPicture->image_url = $url;
            $refPicture->save();
        }
    }

    private function checkOrderForAttraction($ref_attraction_id): bool
    {
        $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($ref_attraction_id) {
                    $query->where('ref_attraction_id', $ref_attraction_id);
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

    private function checkPackageForAttraction($ref_attraction_id): bool
    {
        $packageHs = PackageH::with('packageDs')
                ->whereHas('packageDs', function ($query) use ($ref_attraction_id) {
                    $query->where('ref_attraction_id', $ref_attraction_id);
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

    private function updateIsActiveAttraction($ref_attraction_id, $status): void
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        $attraction->update([
            'is_active' => $status
        ]);
    }

    private function getActiveAttractionDataSortedWithLimit($limit)
    {
        $attraction = RefAttraction::
            join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
            join('agencies', 'agency_affiliates.agency_id', '=', 'agencies.agency_id')->
            join('ref_zipcodes', 'ref_attractions.ref_zipcode_id', '=', 'ref_zipcodes.ref_zipcode_id')->
            select(
                'ref_attractions.*', 
                'agency_affiliates.base_price', 
                'agencies.agency_name',
                DB::raw("CONCAT(ref_zipcodes.area_1, ', ', ref_zipcodes.area_2, ', ', ref_zipcodes.area_3, ', ', ref_zipcodes.area_4) as address_zipcode")
                )->
            where('is_active', '1')->
            where('qty', '>', '0')->
            orderBy('rating', 'desc')->
            orderBy('updated_at', 'desc')->
            orderby('agency_affiliates.base_price', 'asc')->
            orderBy('qty', 'desc')->
            limit($limit)->get();

        foreach ($attraction as $key => $value)
        {
            $picture = RefPicture::where('ref_attraction_id', $value->ref_attraction_id)->first();

            $base_price = AgencyAffiliate::where('ref_attraction_id', $value->ref_attraction_id)->first()->base_price;

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
            $value->address_zipcode = ucwords(strtolower($value->address_zipcode));
        }

        return $attraction;
    }

    private function getActiveAttractionsByAgencyId($agency_id)
    {
        $attraction = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        join('ref_zipcodes', 'ref_attractions.ref_zipcode_id', '=', 'ref_zipcodes.ref_zipcode_id')->
        leftjoin('ref_pictures', 'ref_attractions.ref_attraction_id', '=', 'ref_pictures.ref_attraction_id')->
        select(
            'ref_attractions.*', 
            'agency_affiliates.base_price', 
            'ref_pictures.image_url',
            DB::raw("CONCAT(ref_zipcodes.area_1, ', ', ref_zipcodes.area_2, ', ', ref_zipcodes.area_3, ', ', ref_zipcodes.area_4) as address_zipcode")
            )->
        where('ref_attractions.is_active', true)->
        where('agency_affiliates.agency_id', $agency_id)->
        get();

        $attraction->transform(function($attraction) {
            $attraction->address_zipcode = ucwords(strtolower($attraction->address_zipcode));
            return $attraction;
        });

        return $attraction;
    }

    private function updateRating($ref_attraction_id, $rating): void
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        $attraction->update([
            'rating' => $rating
        ]);
    }

    private function getAverage($numbers)
    {
        $sum = array_sum($numbers);
        $count = count($numbers);
        return $sum / $count;
    }

    private function checkDataEmpty($data)
    {
        if(count($data) <= 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkDataNull($data)
    {
        if($data == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function strTitleFormat($string)
    {
        return ucwords(strtolower($string));
    }
    #endregion

    #region Public Function
    public function GetAttractionByCode(GetRefAttractionByCodeRequest $request)
    {
        $attraction = $this->getRefAttractionByCode($request->attraction_code);

        return response()->json($attraction);
    }

    public function GetAttractionById(GetRefAttractionByIdRequest $request)
    {
        $attraction = $this->getRefAttractionById($request->ref_attraction_id);

        $attractionPicture = $this->getRefPictureByAttractionId($request->ref_attraction_id);

        $agencyAffiliate = $this->getAgencyAffiliateByAttractionId($request->ref_attraction_id);

        $address = $this->getRefZipcodeById($attraction->ref_zipcode_id);

        $addressString = $this->strTitleFormat($address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4);

        if($this->checkDataNull($attraction) == false)
        {
            if($this->checkDataNull($attractionPicture) == false)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'attraction' => $attraction,
                    'picture_url' => $attractionPicture->image_url,
                    'base_price' => $agencyAffiliate->base_price,
                    'agency_id' => $agencyAffiliate->agency_id,
                    'address_zipcode' => $addressString
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'attraction' => $attraction,
                    'picture_url' => "-",
                    'base_price' => $agencyAffiliate->base_price,
                    'agency_id' => $agencyAffiliate->agency_id,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'attraction' => "-",
                'picture_url' => "-",
                'base_price' => "-",
                'agency_id' => "-",
                'address' => "-"
            ], 400);
        }
    }

    public function AddAttraction(StoreRefAttractionRequest $request)
    {
        try
        {
            $attractionCheck = $this->getRefAttractionByCode($request->attraction_code);

            if($attractionCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = $this->getRefZipcodeIdByAllArea($request->area_1, $request->area_2, $request->area_3, $request->area_4);

                $attraction = $this->createRefAttraction(
                    $request->attraction_code,
                    $refZipcodeId,
                    $request->attraction_name,
                    $request->description,
                    $request->address,
                    $request->rating,
                    $request->qty
                );

                $refAttractionId = $attraction->ref_attraction_id;

                if($request->hasFile('picture'))
                {
                    $this->insertRefPictureAttraction($request->file('picture'), $request->attraction_code, $refAttractionId);
                }

                $this->insertAgencyAffiliateAttraction($refAttractionId, $request->agency_id, $request->base_price, $request->promo_code);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Attraction added successfully",
                    'ref_attraction_id' => $refAttractionId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Attraction code already exists",
                    'ref_attraction_id' => "-"
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => "-"
            ], 500);
        }
    }

    public function EditAttractionById(UpdateRefAttractionRequest $request)
    {
        try
        {
            $attraction = $this->getRefAttractionById($request->ref_attraction_id);

            DB::beginTransaction();

            $this->updateAgencyAffiliateAttraction($request->ref_attraction_id, $request->base_price, $request->promo_code);

            $this->updateRefAttraction($request->ref_attraction_id, $request->attraction_name, $request->description, $request->address, $request->qty);

            if($request->picture_url == null)
            {
                if($request->hasFile('picture'))
                {
                    $this->updateRefPictureAttraction($request->file('picture'), $request->attraction_code, $request->ref_attraction_id);
                }
            }

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "Attraction edited successfully",
                'ref_attraction_id' => $request->ref_attraction_id
            ], 200);
            
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => "-"
            ], 500);
        }
    }

    public function DeactivateAttractionById(RefAttractionIdRequest $request)
    {
        try
        {
            $checkOrders = $this->checkOrderForAttraction($request->ref_attraction_id);

            if($checkOrders == true)
            {
                return response()->json(
                    [
                        'status' => "error",
                        'message' => "Attraction is in active order",
                        'ref_attraction_id' => $request->ref_attraction_id
                    ],
                    400
                );
            }

            $checkPackages = $this->checkPackageForAttraction($request->ref_attraction_id);

            if($checkPackages == true)
            {
                return response()->json(
                    [
                        'status' => "error",
                        'message' => "Attraction is in active package",
                        'ref_attraction_id' => $request->ref_attraction_id
                    ],
                    400
                );
            }

            DB::beginTransaction();

            $this->updateIsActiveAttraction($request->ref_attraction_id, false);

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "Deactivate success",
                'ref_attraction_id' => $request->ref_attraction_id
            ], 200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => "-"
            ], 500);
        }
    }

    public function GetAttractionHomepage()
    {
        $attraction = $this->getActiveAttractionDataSortedWithLimit(Constanta::$homepageDataCount);

        if($this->checkDataEmpty($attraction) == true)
        {
            return response()->json(
                [
                    'status' => "error",
                    'message' => "Data not found",
                    'data'=> []
                ]
                ,400
            );
        }
        else
        {
            return response()->json(
                [
                    'status' => "ok",
                    'message' => "Success",
                    'data'=> $attraction
                ]
            , 200);
        }
    }

    public function GetActiveAttractionByAgencyId(AgencyIdRequest $request)
    {
        $attraction = $this->getActiveAttractionsByAgencyId($request->agency_id);

        if($this->checkDataEmpty($attraction) == true)
        {
            return response()->json(
                [
                    'status' => "error",
                    'message' => "Data not found",
                    'data'=> []
                ]
                ,400
            );
        }
        else
        {
            return response()->json(
                [
                    'status' => "ok",
                    'message' => "Success",
                    'data'=> $attraction
                ]
            , 200);
        }

        return response()->json($attraction);
    }

    public function RateAttraction(RateProductRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $attraction = $this->getRefAttractionById($request->id);

            if($attraction->rating != null)
            {
                $ratingAvg = $this->getAverage([$attraction->rating, $request->rating]);
                
                $this->updateRating($request->id, $ratingAvg);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Attraction has been rated",
                    'ref_attraction_id' => $request->id
                ], 200);
            }
            else
            { 
                $this->updateRating($request->id, $request->rating);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Attraction has been rated",
                    'ref_attraction_id' => $request->id
                ], 200);
            }
        }
        catch (\Exception $e)
        {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => $request->id
            ], 500);
        }
    }
    #endregion

}