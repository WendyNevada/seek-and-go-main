<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Constanta;
use App\Models\RefVehicle;
use App\Models\AgencyAffiliate;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefVehicleInterface;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;

class RefVehicleController extends Controller
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
    public function store(StoreRefVehicleRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefVehicleRequest $request, RefVehicle $refVehicle)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefVehicle $refVehicle)
    {
        //
    }

    public function AddVehicle(RefVehicleInterface $refVehicleInterface, StoreRefVehicleRequest $request)
    {
        $response = $refVehicleInterface->AddVehicle($request);
        return $response;
    }

    public function EditVehicleById(RefVehicleInterface $refVehicleInterface, UpdateRefVehicleRequest $request)
    {
        $response = $refVehicleInterface->EditVehicleById($request);
        return $response;
    }

    public function DeactivateVehicleById(RefVehicleInterface $refVehicleInterface, RefVehicleIdRequest $request)
    {
        $response = $refVehicleInterface->DeactivateVehicleById($request);
        return $response;
    }

    public function GetVehicleById(RefVehicleInterface $refVehicleInterface, GetRefVehicleByIdRequest $request)
    {
        $response = $refVehicleInterface->GetVehicleById($request);
        return $response;
    }

    public function GetVehicleHomepage(RefVehicleInterface $refVehicleInterface)
    {
        $response = $refVehicleInterface->GetVehicleHomepage();
        return $response;
    }

    public function GetActiveVehicleByAgencyId(RefVehicleInterface $refVehicleInterface, AgencyIdRequest $request)
    {
        $response = $refVehicleInterface->GetActiveVehicleByAgencyId($request);
        return $response;
    }

}
