<?php

namespace App\Http\Controllers\API\V1;

use App\Models\PromoHistory;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StorePromoHistoryRequest;
use App\Http\Requests\V1\UpdatePromoHistoryRequest;

class PromoHistoryController extends Controller
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
    public function store(StorePromoHistoryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PromoHistory $promoHistory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PromoHistory $promoHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePromoHistoryRequest $request, PromoHistory $promoHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PromoHistory $promoHistory)
    {
        //
    }
}
