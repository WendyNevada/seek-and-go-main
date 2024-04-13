<?php

namespace App\Http\Controllers\API\V1;

use App\Models\OrderH;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\CustIdRequest;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V1\StoreOrderHRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V1\UpdateOrderHRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHController extends Controller
{   
    public function CreateOrder(OrderHInterface $orderHInterface, CreateOrderRequest $request)
    {
        $response = $orderHInterface->CreateOrder($request);
        return $response;
    }

    public function GetOrderDashboard(OrderHInterface $orderHInterface, GetOrderDashboardRequest $request)
    {
        $response = $orderHInterface->GetOrderDashboard($request);
        return $response;
    }

    public function GetNewOrderForCustomer(OrderHInterface $orderHInterface, CustIdRequest $request)
    {
        $response = $orderHInterface->GetNewOrderForCustomer($request);
        return $response;
    }

    public function GetApvOrderForCustomer(OrderHInterface $orderHInterface, CustIdRequest $request)
    {
        $response = $orderHInterface->GetApvOrderForCustomer($request);
        return $response;
    }

    public function GetRetryPayOrderForCustomer(OrderHInterface $orderHInterface, CustIdRequest $request)
    {
        $response = $orderHInterface->GetRetryPayOrderForCustomer($request);
        return $response;
    }

    public function ApproveOrder(OrderHInterface $orderHInterface, OrderHIdRequest $request)
    {
        $response = $orderHInterface->ApproveOrder($request);
        return $response;
    }

    public function GetOrderById(OrderHInterface $orderHInterface, GetOrderByIdRequest $request)
    {
        $response = $orderHInterface->GetOrderById($request);
        return $response;
    }

    public function RejectOrder(OrderHInterface $orderHInterface, OrderHIdRequest $request)
    {
        $response = $orderHInterface->RejectOrder($request);
        return $response;
    }

    public function CancelOrder(OrderHInterface $orderHInterface, OrderHIdRequest $request)
    {
        $response = $orderHInterface->CancelOrder($request);
        return $response;
    }

    public function PaidOrder(OrderHInterface $orderHInterface, OrderHIdRequest $request)
    {
        $response = $orderHInterface->PaidOrder($request);
        return $response;
    }

    public function RetryPaymentOrder(OrderHInterface $orderHInterface, OrderHIdRequest $request)
    {
        $response = $orderHInterface->RetryPaymentOrder($request);
        return $response;
    }

    public function GetCustPaidOrder(OrderHInterface $orderHInterface, GetOrderDashboardRequest $request)
    {
        $response = $orderHInterface->GetCustPaidOrder($request);
        return $response;
    }

}
