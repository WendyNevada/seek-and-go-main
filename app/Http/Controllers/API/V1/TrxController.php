<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Services\TrxService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CustPaymentRequest;
use App\Http\Requests\V2\RateProductRequest;

class TrxController extends Controller
{
    public function CustPayment(TrxService $trxService, CustPaymentRequest $request)
    {
        $response = $trxService->CustPayment($request);
        return $response;
    }

    public function CancelCustPayment(TrxService $trxService, OrderHIdRequest $request)
    {
        $response = $trxService->CancelCustPayment($request);
        return $response;
    }

    public function GetTrxByOrderHId(TrxService $trxService, OrderHIdRequest $request)
    {
        $response = $trxService->GetTrxByOrderHId($request);
        return $response;
    }

    public function RateProduct(TrxService $trxService, RateProductRequest $request)
    {
        $response = $trxService->RateProduct($request);
        return $response;
    }
}
