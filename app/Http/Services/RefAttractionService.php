<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefAttractionInterface;
use App\Models\RefAttraction;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Models\AgencyAffiliate;
use App\Models\Constanta;
use App\Models\RefPicture;
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

        if($attraction != null)
        {
            if($attractionPicture != null)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'attraction' => $attraction,
                    'picture_url' => $attractionPicture->image_url
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'attraction' => $attraction,
                    'picture_url' => "-"
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'attraction' => "-",
                'picture_url' => "-"
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

                $attraction = RefAttraction::
                create(
                    [
                        'attraction_code' => $request->attraction_code,
                        'ref_zipcode_id' => $request->ref_zipcode_id,
                        'attraction_name' => $request->attraction_name,
                        'description' => $request->description,
                        'address' => $request->address,
                        'rating' => $request->rating,
                        'is_active' => $request->is_active,
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
                    'message' => "success",
                    'ref_attraction_id' => $refAttractionId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "attraction code already exist",
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
            ]. 500);
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

                $attraction = $attraction
                ->update(
                    [
                        'ref_zipcode_id' => $request->ref_zipcode_id,
                        'attraction_name' => $request->attraction_name,
                        'description' => $request->description,
                        'address' => $request->address,
                        'is_active' => $request->is_active,
                        'qty' => $request->qty,
                        'promo_code' => $request->promo_code
                    ]
                );

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
                    'message' => "success",
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

    public function GetAttractionHomepage()
    {
        $attraction = RefAttraction::orderBy('rating', 'desc')->limit(Constanta::$homepageDataCount)->get();

        foreach ($attraction as $key => $value)
        {
            $picture = RefPicture::where('ref_attraction_id', $value->ref_attraction_id)->first();

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

        return response()->json($attraction);
    }

}