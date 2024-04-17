<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefAttraction;
use App\Http\Controllers\Controller;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefAttractionInterface;
use App\Http\Requests\V2\RefAttractionIdRequest;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;

class RefAttractionController extends Controller
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
    public function store(StoreRefAttractionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefAttractionRequest $request, RefAttraction $refAttraction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefAttraction $refAttraction)
    {
        //
    }

    public function GetAttractionByCode(RefAttractionInterface $refAttractionInterface, GetRefAttractionByCodeRequest $request)
    {
        $response = $refAttractionInterface->GetAttractionByCode($request);
        return $response;
    }

    public function GetAttractionById(RefAttractionInterface $refAttractionInterface, GetRefAttractionByIdRequest $request)
    {
        $response = $refAttractionInterface->GetAttractionById($request);
        return $response;
    }

    public function AddAttraction(RefAttractionInterface $refAttractionInterface, StoreRefAttractionRequest $request)
    {
        $response = $refAttractionInterface->AddAttraction($request);
        return $response;
    }

    public function EditAttractionById(RefAttractionInterface $refAttractionInterface, UpdateRefAttractionRequest $request)
    {
        $response = $refAttractionInterface->EditAttractionById($request);
        return $response;
    }

    public function DeactivateAttractionById(RefAttractionInterface $refAttractionInterface, RefAttractionIdRequest $request)
    {
        $response = $refAttractionInterface->DeactivateAttractionById($request);
        return $response;
    }

    public function GetAttractionHomepage(RefAttractionInterface $refAttractionInterface)
    {
        $response = $refAttractionInterface->GetAttractionHomepage();
        return $response;
    }

    public function GetActiveAttractionByAgencyId(RefAttractionInterface $refAttractionInterface, AgencyIdRequest $request)
    {
        $response = $refAttractionInterface->GetActiveAttractionByAgencyId($request);
        return $response;
    }
}
