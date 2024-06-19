<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefAttraction;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Services\RefAttractionService;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;

class RefAttractionController extends Controller
{
    public function GetAttractionByCode(RefAttractionService $refAttractionService, GetRefAttractionByCodeRequest $request)
    {
        $response = $refAttractionService->GetAttractionByCode($request);
        return $response;
    }

    public function GetAttractionById(RefAttractionService $refAttractionService, GetRefAttractionByIdRequest $request)
    {
        $response = $refAttractionService->GetAttractionById($request);
        return $response;
    }

    public function AddAttraction(RefAttractionService $refAttractionService, StoreRefAttractionRequest $request)
    {
        $response = $refAttractionService->AddAttraction($request);
        return $response;
    }

    public function EditAttractionById(RefAttractionService $refAttractionService, UpdateRefAttractionRequest $request)
    {
        $response = $refAttractionService->EditAttractionById($request);
        return $response;
    }

    public function DeactivateAttractionById(RefAttractionService $refAttractionService, RefAttractionIdRequest $request)
    {
        $response = $refAttractionService->DeactivateAttractionById($request);
        return $response;
    }

    public function GetAttractionHomepage(RefAttractionService $refAttractionService)
    {
        $response = $refAttractionService->GetAttractionHomepage();
        return $response;
    }

    public function GetActiveAttractionByAgencyId(RefAttractionService $refAttractionService, AgencyIdRequest $request)
    {
        $response = $refAttractionService->GetActiveAttractionByAgencyId($request);
        return $response;
    }

    public function GetActiveAttractionByAgencyIdWithoutQty(RefAttractionService $refAttractionService, AgencyIdRequest $request)
    {
        $response = $refAttractionService->GetActiveAttractionByAgencyIdWithoutQty($request);
        return $response;
    }

    public function RateAttraction(RefAttractionService $refAttractionService, RateProductRequest $request)
    {
        $response = $refAttractionService->RateAttraction($request);
        return $response;
    }
}
