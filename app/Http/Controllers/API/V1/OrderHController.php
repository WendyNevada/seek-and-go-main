<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Services\OrderHService;
use App\Http\Requests\V2\CustIdRequest;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CancelOrderRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetCustomerOrderRequest;
use App\Http\Requests\V2\UploadOrderImageRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHController extends Controller
{   
    public function CreateOrder(OrderHService $orderHService, CreateOrderRequest $request)
    {
        $response = $orderHService->CreateOrder($request);
        return $response;
    }

    public function GetNewOrderDashboard(OrderHService $orderHService, GetOrderDashboardRequest $request)
    {
        $response = $orderHService->GetNewOrderDashboard($request);
        return $response;
    }

    public function GetNewOrderForCustomer(OrderHService $orderHService, CustIdRequest $request)
    {
        $response = $orderHService->GetNewOrderForCustomer($request);
        return $response;
    }

    public function GetApvOrderForCustomer(OrderHService $orderHService, CustIdRequest $request)
    {
        $response = $orderHService->GetApvOrderForCustomer($request);
        return $response;
    }

    public function GetRetryPayOrderForCustomer(OrderHService $orderHService, CustIdRequest $request)
    {
        $response = $orderHService->GetRetryPayOrderForCustomer($request);
        return $response;
    }

    public function GetCustomerOrderByIdAndStatus(OrderHService $orderHService, GetCustomerOrderRequest $request)
    {
        $response = $orderHService->GetCustomerOrderByIdAndStatus($request);
        return $response;
    }

    public function ApproveOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->ApproveOrder($request);
        return $response;
    }

    public function GetOrderById(OrderHService $orderHService, GetOrderByIdRequest $request)
    {
        $response = $orderHService->GetOrderById($request);
        return $response;
    }

    public function RejectOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->RejectOrder($request);
        return $response;
    }

    public function CancelOrderAgency(OrderHService $orderHService, CancelOrderRequest $request)
    {
        $response = $orderHService->CancelOrderAgency($request);
        return $response;
    }

    public function CancelOrderCustomer(OrderHService $orderHService, CancelOrderRequest $request)
    {
        $response = $orderHService->CancelOrderCustomer($request);
        return $response;
    }

    public function CustPaidOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->CustPaidOrder($request);
        return $response;
    }

    public function PaidOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->PaidOrder($request);
        return $response;
    }

    public function RetryPaymentOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->RetryPaymentOrder($request);
        return $response;
    }

    public function FinishOrder(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->FinishOrder($request);
        return $response;
    }

    public function SendEmailOrderApprove(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->SendEmailOrderApprove($request);
        return $response;
    }

    public function GetCustPaidOrder(OrderHService $orderHService, GetOrderDashboardRequest $request)
    {
        $response = $orderHService->GetCustPaidOrder($request);
        return $response;
    }

    public function GetStatsForOrder(OrderHService $orderHService, AgencyIdRequest $request)
    {
        $response = $orderHService->GetStatsForOrder($request);
        return $response;
    }

    public function GetOrderDashboardByAgencyIdAndStatus(OrderHService $orderHService, GetOrderDashboardRequest $request)
    {
        $response = $orderHService->GetOrderDashboardByAgencyIdAndStatus($request);
        return $response;
    }

    public function UploadOrderImage(OrderHService $orderHService, UploadOrderImageRequest $request)
    {
        $response = $orderHService->UploadOrderImage($request);
        return $response;
    }

    public function GetOrderImage(OrderHService $orderHService, OrderHIdRequest $request)
    {
        $response = $orderHService->GetOrderImage($request);
        return $response;
    }

}
