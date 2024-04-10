<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\CreateOrderRequest;

interface OrderHInterface
{
    public function CreateOrder(CreateOrderRequest $request);
}