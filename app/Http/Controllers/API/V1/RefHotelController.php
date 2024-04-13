<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefHotel;
use App\Models\Constanta;
use App\Models\AgencyAffiliate;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefHotelInterface;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;

class RefHotelController extends Controller
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
    public function store(StoreRefHotelRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefHotel $refHotel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefHotel $refHotel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefHotelRequest $request, RefHotel $refHotel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefHotel $refHotel)
    {
        //
    }

    public function GetHotelById(RefHotelInterface $refHotelInterface, GetRefHotelByIdRequest $request)
    {
        $response = $refHotelInterface->GetHotelById($request);
        return $response;
    }

    public function AddHotel(RefHotelInterface $refHotelInterface, StoreRefHotelRequest $request)
    {
        $response = $refHotelInterface->AddHotel($request);
        return $response;
    }

    public function EditHotelById(RefHotelInterface $refHotelInterface, UpdateRefHotelRequest $request)
    {
        $response = $refHotelInterface->EditHotelById($request);
        return $response;
    }

    public function GetHotelHomepage(RefHotelInterface $refHotelInterface)
    {
        $response = $refHotelInterface->GetHotelHomepage();
        return $response;
    }

    public function GetActiveHotelByAgencyId(RefHotelInterface $refHotelInterface, AgencyIdRequest $request)
    {
        $response = $refHotelInterface->GetActiveHotelByAgencyId($request);
        return $response;
    }
}
