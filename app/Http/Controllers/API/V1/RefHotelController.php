<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Services\RefHotelService;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;

class RefHotelController extends Controller
{
    public function GetHotelById(RefHotelService $refHotelService, GetRefHotelByIdRequest $request)
    {
        $response = $refHotelService->GetHotelById($request);
        return $response;
    }

    public function AddHotel(RefHotelService $refHotelService, StoreRefHotelRequest $request)
    {
        $response = $refHotelService->AddHotel($request);
        return $response;
    }

    public function EditHotelById(RefHotelService $refHotelService, UpdateRefHotelRequest $request)
    {
        $response = $refHotelService->EditHotelById($request);
        return $response;
    }

    public function DeactivateHotelById(RefHotelService $refHotelService, RefHotelIdRequest $request)
    {
        $response = $refHotelService->DeactivateHotelById($request);
        return $response;
    }

    public function GetHotelHomepage(RefHotelService $refHotelService)
    {
        $response = $refHotelService->GetHotelHomepage();
        return $response;
    }

    public function GetActiveHotelByAgencyId(RefHotelService $refHotelService, AgencyIdRequest $request)
    {
        $response = $refHotelService->GetActiveHotelByAgencyId($request);
        return $response;
    }

    public function GetActiveHotelByAgencyIdWithoutQty(RefHotelService $refHotelService, AgencyIdRequest $request)
    {
        $response = $refHotelService->GetActiveHotelByAgencyIdWithoutQty($request);
        return $response;
    }

    public function RateHotel(RefHotelService $refHotelService, RateProductRequest $request)
    {
        $response = $refHotelService->RateHotel($request);
        return $response;
    }
}
