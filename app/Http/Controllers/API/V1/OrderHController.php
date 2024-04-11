<?php

namespace App\Http\Controllers\API\V1;

use App\Models\OrderH;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\OrderHInterface;
use App\Http\Requests\V1\StoreOrderHRequest;
use App\Http\Requests\V2\CreateOrderRequest;
use App\Http\Requests\V1\UpdateOrderHRequest;
use App\Http\Requests\V2\GetOrderDashboardRequest;

class OrderHController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderHRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(OrderH $orderH)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrderH $orderH)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderHRequest $request, OrderH $orderH)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrderH $orderH)
    {
        //
    }
    
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

}
