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
    #region Private Function
    private function getArea1()
    {
        $area1 = RefZipcode::select('area_1')->distinct()->get();
        return $area1;
    }

    private function getAreaByAreaCode($area_select, $area_where, $area_code)
    {
        $areas = RefZipcode::select("$area_select")
            ->where("$area_where", 'like', "%$area_code%")
            ->distinct()
            ->get();
        
        return $areas;
    }

    private function getRefZipcodeIdByAreaCode3AndAreaCode4($area3, $area4)
    {
        $refZipcodeId = RefZipcode::where('area_3', 'like', "%$area3%")
            ->where('area_4', 'like', "%$area4%")
            ->value('ref_zipcode_id');

        return $refZipcodeId;
    }
    #endregion

    #region Public Function
    public function GetAllArea1()
    {
        $area1 = $this->getArea1();
        
        return response()->json($area1, 200);   
    }

    public function GetArea2ByArea1(GetRefZipcodeByAreaRequest $request)
    {
        $area_code = $request->area_code;

        $areas = $this->getAreaByAreaCode('area_2', 'area_1', $area_code);

        return response()->json($areas, 200);
    }

    public function GetArea3ByArea2(GetRefZipcodeByAreaRequest $request)
    {
        $area_code = $request->area_code;

        $areas = $this->getAreaByAreaCode('area_3', 'area_2', $area_code);

        return response()->json($areas, 200);
    }

    public function GetArea4ByArea3(GetRefZipcodeByAreaRequest $request)
    {
        $area_code = $request->area_code;

        $areas = $this->getAreaByAreaCode('area_4', 'area_3', $area_code);

        return response()->json($areas, 200);
    }

    public function GetRefZipcodeIdByArea4AndArea3(GetRefZipcodeIdByArea3AndArea4 $request)
    {
        $area3 = $request->area_3;
        $area4 = $request->area_4;

        $refZipcodeId = $this->getRefZipcodeIdByAreaCode3AndAreaCode4($area3, $area4);

        return response()->json(
            ['ref_zipcode_id' => $refZipcodeId]
        ,200);
    }
    #endregion
}