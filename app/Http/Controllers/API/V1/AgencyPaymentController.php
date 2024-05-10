<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Services\AgencyPaymentService;
use App\Http\Requests\V2\AgencyPaymentIdRequest;
use App\Http\Requests\V1\StoreAgencyPaymentRequest;
use App\Http\Requests\V1\UpdateAgencyPaymentRequest;

class AgencyPaymentController extends Controller
{
    public function GetAllAgencyPaymentByAgencyId(AgencyPaymentService $agencyPaymentService, AgencyIdRequest $request)
    {
        $response = $agencyPaymentService->GetAllAgencyPaymentByAgencyId($request);
        return $response;
    }

    public function InsertAgencyPayment(AgencyPaymentService $agencyPaymentService, StoreAgencyPaymentRequest $request)
    {
        $response = $agencyPaymentService->InsertAgencyPayment($request);
        return $response;
    }

    public function EditAgencyPayment(AgencyPaymentService $agencyPaymentService, UpdateAgencyPaymentRequest $request)
    {
        $response = $agencyPaymentService->EditAgencyPayment($request);
        return $response;
    }

    public function RemoveAgencyPayment(AgencyPaymentService $agencyPaymentService, AgencyPaymentIdRequest $request)
    {
        $response = $agencyPaymentService->RemoveAgencyPayment($request);
        return $response;
    }
}
