<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Services\RefZipcodeService;
use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy2AreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy3AreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

class RefZipcodeController extends Controller
{
    public function GetAllArea1(RefZipcodeService $refZipcodeService)
    {
        $response = $refZipcodeService->GetAllArea1();
        return $response;
    }

    public function GetArea2ByArea1(RefZipcodeService $refZipcodeService, GetRefZipcodeByAreaRequest $request)
    {
        $response = $refZipcodeService->GetArea2ByArea1($request);
        return $response;
    }

    public function GetArea3ByArea2AndArea1(RefZipcodeService $refZipcodeService, GetRefZipcodeBy2AreaRequest $request)
    {
        $response = $refZipcodeService->GetArea3ByArea2AndArea1($request);
        return $response;
    }

    public function GetArea4ByArea3AndArea2AndArea1(RefZipcodeService $refZipcodeService, GetRefZipcodeBy3AreaRequest $request)
    {
        $response = $refZipcodeService->GetArea4ByArea3AndArea2AndArea1($request);
        return $response;
    }
    
}
