<?php

namespace App\Http\Services;

use App\Http\Interfaces\RefZipcodeInterface;
use App\Models\RefZipcode;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreRefZipcodeRequest;
use App\Http\Requests\V1\UpdateRefZipcodeRequest;
use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

class RefZipcodeService implements RefZipcodeInterface
{
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