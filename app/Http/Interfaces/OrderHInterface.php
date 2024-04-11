<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

interface OrderHInterface
{
    public function CreateOrder(CreateOrderRequest $request);

    public function GetOrderDashboard(GetOrderDashboardRequest $request);
}