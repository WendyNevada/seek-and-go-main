<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\CustIdRequest;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\OrderHIdRequest;
use App\Http\Requests\V2\CancelOrderRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V2\GetOrderByIdRequest;
use App\Http\Requests\V2\GetCustomerOrderRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

interface OrderHInterface
{
    public function CreateOrder(CreateOrderRequest $request);

    public function GetNewOrderDashboard(GetOrderDashboardRequest $request);

    public function GetNewOrderForCustomer(CustIdRequest $request);

    public function GetApvOrderForCustomer(CustIdRequest $request);

    public function GetRetryPayOrderForCustomer(CustIdRequest $request);

    public function GetCustomerOrderByIdAndStatus(GetCustomerOrderRequest $request);

    public function GetOrderById(GetOrderByIdRequest $request);

    public function ApproveOrder(OrderHIdRequest $request);

    public function RejectOrder(OrderHIdRequest $request);

    public function CancelOrderAgency(CancelOrderRequest $request);
    
    public function CancelOrderCustomer(CancelOrderRequest $request);

    public function CustPaidOrder(OrderHIdRequest $request);

    public function PaidOrder(OrderHIdRequest $request);

    public function RetryPaymentOrder(OrderHIdRequest $request);

    public function FinishOrder(OrderHIdRequest $request);

    public function SendEmailOrderApprove(OrderHIdRequest $request);

    public function GetCustPaidOrder(GetOrderDashboardRequest $request);

    public function GetStatsForOrder(AgencyIdRequest $request);

    public function GetOrderDashboardByAgencyIdAndStatus(GetOrderDashboardRequest $request);
}