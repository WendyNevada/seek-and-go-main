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
    public function GetAttractionByCode(GetRefAttractionByCodeRequest $request)
    {
        $attraction = RefAttraction::where('attraction_code', $request->attraction_code)->first();
        return response()->json($attraction);
    }

    public function GetAttractionById(GetRefAttractionByIdRequest $request)
    {
        $attraction = RefAttraction::where('ref_attraction_id', $request->ref_attraction_id)->first();

        $attractionPicture = RefPicture::where('ref_attraction_id', $request->ref_attraction_id)->first();

        $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $request->ref_attraction_id)->first();

        $address = RefZipcode::where('ref_zipcode_id', $attraction->ref_zipcode_id)->first();

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
        try
        {
            $attractionCheck = RefAttraction::where('attraction_code', $request->attraction_code)->first();

            if($attractionCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = RefZipcode::
                    where('area_1', $request->area_1)->
                    where('area_2', $request->area_2)->
                    where('area_3', $request->area_3)->
                    where('area_4', $request->area_4)->
                    first()->ref_zipcode_id;

                $attraction = RefAttraction::
                create(
                    [
                        'attraction_code' => $request->attraction_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'attraction_name' => $request->attraction_name,
                        'description' => $request->description,
                        'address' => $request->address,
                        'rating' => $request->rating,
                        'is_active' => true,
                        'qty' => $request->qty,
                        'promo_code' => $request->promo_code
                    ]
                );

                $refAttractionId = $attraction->ref_attraction_id;

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $request->attraction_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refAttractionPictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = new RefPicture();

                    $refPicture->ref_attraction_id = $refAttractionId;
                    $refPicture->image_url = $url;
                    $refPicture->save();
                }

                $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_attraction_id' => $refAttractionId,
                        'agency_id' => $request->agency_id,
                        'base_price' => $request->base_price,
                        'promo_code' => $request->promo_code_affiliate
                    ]
                );

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
            $attraction = RefAttraction::where('ref_attraction_id', $request->ref_attraction_id)->first();

            if($attraction != null)
            {
                DB::beginTransaction();

                $agencyAffiliate = AgencyAffiliate::where('ref_attraction_id', $attraction->ref_attraction_id)->first();

                $agencyAffiliate->update(
                    [
                        'base_price' => $request->base_price
                    ]
                );

                $attraction->update([
                    'attraction_name' => $request->attraction_name,
                    'description' => $request->description,
                    'address' => $request->address,
                    'qty' => $request->qty,
                    'promo_code' => $request->promo_code
                ]);

                if($request->hasFile('picture'))
                {
                    $image = $request->file('picture');
                    $imageName =  $attraction->attraction_code . '_' . time() . '.' . $image->getClientOriginalName();
                    $path = $image->storeAs(Constanta::$refAttractionPictureDirectory, $imageName, Constanta::$refPictureDisk);
                    $url = Storage::url($path);

                    $refPicture = RefPicture::where('ref_attraction_id', $attraction->ref_attraction_id)->first();
                    if($refPicture != null)
                    {
                        $refPicture->image_url = $url;
                        $refPicture->save();
                    }
                    else
                    {
                        $refPicture = new RefPicture();
                        $refPicture->ref_attraction_id = $attraction->ref_attraction_id;
                        $refPicture->image_url = $url;
                        $refPicture->save();
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
        try
        {
            $attraction = RefAttraction::where('ref_attraction_id', $request->ref_attraction_id)->first();

            if($attraction != null)
            {
                $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($request) {
                    $query->where('ref_attraction_id', $request->ref_attraction_id);
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
                            'message' => "Attraction is in active order",
                            'ref_attraction_id' => $request->ref_attraction_id
                        ],
                        400
                    );
                }

                $packageHs = PackageH::with('packageDs')
                ->whereHas('packageDs', function ($query) use ($request) {
                    $query->where('ref_attraction_id', $request->ref_attraction_id);
                })
                ->where('is_active', true)
                ->get();

                if(count($packageHs) > 0)
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

                $attraction->update(
                    [
                        'is_active' => '0'
                    ]
                );

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
        $attraction = RefAttraction::where('is_active', '1')->orderBy('rating', 'desc')->limit(Constanta::$homepageDataCount)->get();

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

        return response()->json($attraction);
    }

    public function GetActiveAttractionByAgencyId(AgencyIdRequest $request)
    {
        $attraction = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        leftjoin('ref_pictures', 'ref_attractions.ref_attraction_id', '=', 'ref_pictures.ref_attraction_id')->
        select('ref_attractions.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_attractions.is_active', true)->
        where('agency_affiliates.agency_id', $request->agency_id)->
        limit(Constanta::$homepageDataCount)->
        get();

        return response()->json($attraction);
    }

}