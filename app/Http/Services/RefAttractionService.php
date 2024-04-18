<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefAttractionInterface;
use App\Models\RefAttraction;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use App\Models\OrderD;
use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\RefPicture;
use App\Models\RefZipcode;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RefAttractionService implements RefAttractionInterface
{
    #region Private Function
    private function getRefAttractionByCode($attraction_code): RefAttraction
    {
        $attraction = RefAttraction::where('attraction_code', $attraction_code)->first();

        return $attraction;
    }

    private function getRefAttractionById($ref_attraction_id): RefAttraction
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        return $attraction;
    }

    private function getRefPictureByAttractionId($ref_attraction_id): RefPicture
    {
        $attractionPicture = RefPicture::where('ref_attraction_id', $ref_attraction_id)->first();

        return $attractionPicture;
    }

    private function getAgencyAffiliateByAttractionId($ref_attraction_id): AgencyAffiliate
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $ref_attraction_id)->first();

        return $agencyAffiliate;
    }

    private function getRefZipcodeById($ref_zipcode_id): RefZipcode
    {
        $refZipcode = RefZipcode::where('ref_zipcode_id', $ref_zipcode_id)->first();

        return $refZipcode;
    }

    private function getRefZipcodeIdByAllArea($area_1, $area_2, $area_3, $area_4): RefZipcode
    {
        $refZipcodeId = RefZipcode::
                    where('area_1', $area_1)->
                    where('area_2', $area_2)->
                    where('area_3', $area_3)->
                    where('area_4', $area_4)->
                    first()->ref_zipcode_id;

        return $refZipcodeId;
    }

    private function createRefAttraction($attraction_code, $refZipcodeId, $attraction_name, $description, $address, $rating, $qty, $promo_code) : RefAttraction
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
                        'qty' => $qty,
                        'promo_code' => $promo_code
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

    private function insertAgencyAffiliateAttraction($ref_attraction_id, $agency_id, $base_price, $promo_code_affiliate): void
    {
        $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_attraction_id' => $ref_attraction_id,
                        'agency_id' => $agency_id,
                        'base_price' => $base_price,
                        'promo_code' => $promo_code_affiliate
                    ]
                );
    }

    private function updatePriceAgencyAffiliateAttraction($ref_attraction_id, $base_price): void
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $ref_attraction_id)->first();

        $agencyAffiliate->update(
            [
                'base_price' => $base_price
            ]
        );
    }

    private function updateRefAttraction($ref_attraction_id, $attraction_name, $description, $address, $qty, $promo_code): void
    {
        $attraction = RefAttraction::where('ref_attraction_id', $ref_attraction_id)->first();

        $attraction->update([
            'attraction_name' => $attraction_name,
            'description' => $description,
            'address' => $address,
            'qty' => $qty,
            'promo_code' => $promo_code
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
        $attraction = RefAttraction::where('is_active', '1')->orderBy('rating', 'desc')->limit($limit)->get();

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
        }

        return $attraction;
    }

    private function getAttractionsByAgencyId($agency_id, $limit)
    {
        $attraction = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        leftjoin('ref_pictures', 'ref_attractions.ref_attraction_id', '=', 'ref_pictures.ref_attraction_id')->
        select('ref_attractions.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_attractions.is_active', true)->
        where('agency_affiliates.agency_id', $agency_id)->
        limit($limit)->
        get();

        return response()->json($attraction);
    }
    #endregion

    #region Public Function
    public function GetAttractionByCode(GetRefAttractionByCodeRequest $request)
    {
        $attractionService = new RefAttractionService();

        $attraction = $attractionService->getRefAttractionByCode($request->attraction_code);

        return response()->json($attraction);
    }

    public function GetAttractionById(GetRefAttractionByIdRequest $request)
    {
        $attractionService = new RefAttractionService();

        $attraction = $attractionService->getRefAttractionById($request->ref_attraction_id);

        $attractionPicture = $attractionService->getRefPictureByAttractionId($request->ref_attraction_id);

        $agencyAffiliate = $attractionService->getAgencyAffiliateByAttractionId($request->ref_attraction_id);

        $address = $attractionService->getRefZipcodeById($attraction->ref_zipcode_id);

        if($attraction != null)
        {
            if($attractionPicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'attraction' => $attraction,
                    'picture_url' => $attractionPicture->image_url,
                    'base_price' => $agencyAffiliate->base_price,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
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
                'address' => "-"
            ], 400);
        }
    }

    public function AddAttraction(StoreRefAttractionRequest $request)
    {
        $attractionService = new RefAttractionService();
        try
        {
            $attractionCheck = $attractionService->getRefAttractionByCode($request->attraction_code);

            if($attractionCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = $attractionService->getRefZipcodeIdByAllArea($request->area_1, $request->area_2, $request->area_3, $request->area_4);

                $attraction = $attractionService->createRefAttraction(
                    $request->attraction_code,
                    $refZipcodeId,
                    $request->attraction_name,
                    $request->description,
                    $request->address,
                    $request->rating,
                    $request->qty,
                    $request->promo_code
                );

                $refAttractionId = $attraction->ref_attraction_id;

                if($request->hasFile('picture'))
                {
                    $attractionService->insertRefPictureAttraction($request->file('picture'), $request->attraction_code, $refAttractionId);
                }

                $attractionService->insertAgencyAffiliateAttraction($refAttractionId, $request->agency_id, $request->base_price, $request->promo_code_affiliate);

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
        $attractionService = new RefAttractionService();
        try
        {
            $attraction = $attractionService->getRefAttractionById($request->ref_attraction_id);

            if($attraction != null)
            {
                DB::beginTransaction();

                $attractionService->updatePriceAgencyAffiliateAttraction($request->ref_attraction_id, $request->base_price);

                $attractionService->updateRefAttraction($request->ref_attraction_id, $request->attraction_name, $request->description, $request->address, $request->qty, $request->promo_code);

                if($request->picture_url == null)
                {
                    if($request->hasFile('picture'))
                    {
                        $attractionService->updateRefPictureAttraction($request->file('picture'), $request->attraction_code, $request->ref_attraction_id);
                    }
                }

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Attraction edited successfully",
                    'ref_attraction_id' => $request->ref_attraction_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Data is not found",
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

    public function DeactivateAttractionById(RefAttractionIdRequest $request)
    {
        $attractionService = new RefAttractionService();
        try
        {
            $attraction = $attractionService->getRefAttractionById($request->ref_attraction_id);

            if($attraction != null)
            {
                $checkOrders = $attractionService->checkOrderForAttraction($request->ref_attraction_id);

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

                $checkPackages = $attractionService->checkPackageForAttraction($request->ref_attraction_id);

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

                $attractionService->updateIsActiveAttraction($request->ref_attraction_id, false);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Deactivate success",
                    'ref_attraction_id' => $request->ref_attraction_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Data not found",
                    'ref_attraction_id' => $request->ref_attraction_id
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

    public function GetAttractionHomepage()
    {
        $attractionService = new RefAttractionService();

        $attraction = $attractionService->getActiveAttractionDataSortedWithLimit(Constanta::$homepageDataCount);

        return response()->json($attraction);
    }

    public function GetActiveAttractionByAgencyId(AgencyIdRequest $request)
    {
        $attractionService = new RefAttractionService();

        $attraction = $attractionService->getAttractionsByAgencyId($request->agency_id, Constanta::$homepageDataCount);

        return response()->json($attraction);
    }
    #endregion

}