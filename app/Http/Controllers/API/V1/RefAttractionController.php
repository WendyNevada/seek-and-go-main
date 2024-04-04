<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefAttraction;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use Illuminate\Support\Facades\DB;

class RefAttractionController extends Controller
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
    public function store(StoreRefAttractionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefAttractionRequest $request, RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefAttraction $refAttraction)
    {
        //
    }

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

            DB::commit();

            return [
                'status' => "ok",
                'message' => "success",
                'ref_attraction_id' => $refAttractionId
            ];
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return [
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => "-"
            ];
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

                return [
                    'status' => "ok",
                    'message' => "success",
                    'ref_attraction_id' => $request->ref_attraction_id
                ];
            }
            else
            {
                return [
                    'status' => "error",
                    'message' => "Data is not found",
                    'ref_attraction_id' => "-"
                ];
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return [
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_attraction_id' => "-"
            ];
        }
    }
}
