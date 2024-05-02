<?php

namespace App\Http\Services;

use App\Models\RefZipcode;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\RefZipcodeInterface;
use App\Http\Requests\V1\StoreRefZipcodeRequest;
use App\Http\Requests\V1\UpdateRefZipcodeRequest;
use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy2AreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy3AreaRequest;
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

    private function getAreaBy2AreaCode($area_select, $area_where_1, $area_where_2, $area_1, $area_2)
    {
        $areas = RefZipcode::select("$area_select")
            ->where("$area_where_1", 'like', "%$area_1%")
            ->where("$area_where_2", 'like', "%$area_2%")
            ->distinct()
            ->get();
        
        return $areas;
    }

    private function getAreaBy3AreaCode($area_select, $area_where_1, $area_where_2, $area_where_3, $area_1, $area_2, $area_3)
    {
        $areas = RefZipcode::select("$area_select")
            ->where("$area_where_1", 'like', "%$area_1%")
            ->where("$area_where_2", 'like', "%$area_2%")
            ->where("$area_where_3", 'like', "%$area_3%")
            ->distinct()
            ->get();
        
        return $areas;
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

    public function GetArea3ByArea2AndArea1(GetRefZipcodeBy2AreaRequest $request)
    {
        $area_code = $request->area_code;

        $areas = $this->getAreaBy2AreaCode('area_3', 'area_1', 'area_2', $request->area_1, $request->area_2);

        return response()->json($areas, 200);
    }

    public function GetArea4ByArea3AndArea2AndArea1(GetRefZipcodeBy3AreaRequest $request)
    {
        $area_code = $request->area_code;

        $areas = $this->getAreaBy3AreaCode('area_4', 'area_1', 'area_2', 'area_3', $request->area_1, $request->area_2, $request->area_3);

        return response()->json($areas, 200);
    }
    #endregion
}