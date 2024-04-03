<?php

namespace App\Http\Controllers\API\V1;

use App\Models\AgencyAffiliate;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAgencyAffiliateRequest;
use App\Http\Requests\UpdateAgencyAffiliateRequest;

class AgencyAffiliateController extends Controller
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
    public function store(StoreAgencyAffiliateRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(AgencyAffiliate $agencyAffiliate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AgencyAffiliate $agencyAffiliate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgencyAffiliateRequest $request, AgencyAffiliate $agencyAffiliate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AgencyAffiliate $agencyAffiliate)
    {
        //
    }
}
