<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Services\TrxService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CustPaymentRequest;

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
}
