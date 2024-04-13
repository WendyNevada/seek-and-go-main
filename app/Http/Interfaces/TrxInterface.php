<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CustPaymentRequest;

interface TrxInterface
{
    public function CustPayment(CustPaymentRequest $request);

    public function CancelCustPayment(OrderHIdRequest $request);
}