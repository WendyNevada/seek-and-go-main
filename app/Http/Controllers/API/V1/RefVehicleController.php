<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefVehicle;
use App\Http\Controllers\Controller;
use App\Http\Services\RefVehicleService;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;

class RefVehicleController extends Controller
{
    public function AddVehicle(RefVehicleService $refVehicleService, StoreRefVehicleRequest $request)
    {
        $response = $refVehicleService->AddVehicle($request);
        return $response;
    }

    public function EditVehicleById(RefVehicleService $refVehicleService, UpdateRefVehicleRequest $request)
    {
        $response = $refVehicleService->EditVehicleById($request);
        return $response;
    }

    public function DeactivateVehicleById(RefVehicleService $refVehicleService, RefVehicleIdRequest $request)
    {
        $response = $refVehicleService->DeactivateVehicleById($request);
        return $response;
    }

    public function GetVehicleById(RefVehicleService $refVehicleService, GetRefVehicleByIdRequest $request)
    {
        $response = $refVehicleService->GetVehicleById($request);
        return $response;
    }

    public function GetVehicleHomepage(RefVehicleService $refVehicleService)
    {
        $response = $refVehicleService->GetVehicleHomepage();
        return $response;
    }

    public function GetActiveVehicleByAgencyId(RefVehicleService $refVehicleService, AgencyIdRequest $request)
    {
        $response = $refVehicleService->GetActiveVehicleByAgencyId($request);
        return $response;
    }
    
    public function GetActiveVehicleByAgencyIdWithoutQty(RefVehicleService $refVehicleService, AgencyIdRequest $request)
    {
        $response = $refVehicleService->GetActiveVehicleByAgencyIdWithoutQty($request);
        return $response;
    }

    public function RateVehicle(RefVehicleService $refVehicleService, RateProductRequest $request)
    {
        $response = $refVehicleService->RateVehicle($request);
        return $response;
    }
}
