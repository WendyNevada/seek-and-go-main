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
use Illuminate\Support\Facades\DB;

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
        return response()->json($attraction);
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
        $attraction = RefAttraction::orderBy('rating', 'desc')->get()->take(Constanta::$homepageDataCount);
        return response()->json($attraction);
    }

}