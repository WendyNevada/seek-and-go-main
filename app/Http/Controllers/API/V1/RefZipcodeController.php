<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefZipcode;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRefZipcodeRequest;
use App\Http\Requests\V1\UpdateRefZipcodeRequest;
use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

class RefZipcodeController extends Controller
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
    public function store(StoreRefZipcodeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefZipcodeRequest $request, RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefZipcode $refZipcode)
    {
        //
    }

    public function GetAllArea1()
    {
        return RefZipcode::select('area_1')->distinct()->get();
    }

    public function GetArea2ByArea1(GetRefZipcodeByAreaRequest $request)
    {
        $area = $request->area_code;

        return RefZipcode::select('area_2')
            ->where('area_1', 'like', "%$area%")
            ->distinct()
            ->get();
    }

    public function GetArea3ByArea2(GetRefZipcodeByAreaRequest $request)
    {
        $area = $request->area_code;

        return RefZipcode::select('area_3')
            ->where('area_2', 'like', "%$area%")
            ->distinct()
            ->get();
    }

    public function GetArea4ByArea3(GetRefZipcodeByAreaRequest $request)
    {
        $area = $request->area_code;

        return RefZipcode::select('area_4')
            ->where('area_3', 'like', "%$area%")
            ->distinct()
            ->get();
    }

    public function GetRefZipcodeIdByArea4AndArea3(GetRefZipcodeIdByArea3AndArea4 $request)
    {
        $area3 = $request->area_3;
        $area4 = $request->area_4;

        $refZipcodeId = RefZipcode::where('area_3', 'like', "%$area3%")
            ->where('area_4', 'like', "%$area4%")
            ->value('ref_zipcode_id');

        return response()->json(
            ['ref_zipcode_id' => $refZipcodeId]
        ,200);
    }
}
