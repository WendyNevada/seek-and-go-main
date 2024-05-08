<?php

namespace App\Http\V1\Controllers;

use App\Models\AgencyPayment;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreAgencyPaymentRequest;
use App\Http\Requests\V1\UpdateAgencyPaymentRequest;

class AgencyPaymentController extends Controller
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
    public function store(StoreAgencyPaymentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AgencyPayment $agencyPayment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AgencyPayment $agencyPayment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgencyPaymentRequest $request, AgencyPayment $agencyPayment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AgencyPayment $agencyPayment)
    {
        //
    }
}
