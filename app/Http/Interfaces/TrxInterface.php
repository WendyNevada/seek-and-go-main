<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CustPaymentRequest;
use App\Http\Requests\V2\RateProductRequest;

interface TrxInterface
{
    public function CustPayment(CustPaymentRequest $request);

    public function CancelCustPayment(OrderHIdRequest $request);

    public function GetTrxByOrderHId(OrderHIdRequest $request);

    public function RateProduct(RateProductRequest $request);
}