<?php

namespace App\Http\Controllers\API\V1;

use App\Models\RefZipcode;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\RefZipcodeInterface;
use App\Http\Requests\V1\StoreRefZipcodeRequest;
use App\Http\Requests\V1\UpdateRefZipcodeRequest;
use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

class RefZipcodeController extends Controller
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
    public function store(StoreRefZipcodeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefZipcodeRequest $request, RefZipcode $refZipcode)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RefZipcode $refZipcode)
    {
        //
    }

    public function GetAllArea1(RefZipcodeInterface $refZipcodeInterface)
    {
        $response = $refZipcodeInterface->GetAllArea1();
        return $response;
    }

    public function GetArea2ByArea1(RefZipcodeInterface $refZipcodeInterface, GetRefZipcodeByAreaRequest $request)
    {
        $response = $refZipcodeInterface->GetArea2ByArea1($request);
        return $response;
    }

    public function GetArea3ByArea2(RefZipcodeInterface $refZipcodeInterface, GetRefZipcodeByAreaRequest $request)
    {
        $response = $refZipcodeInterface->GetArea3ByArea2($request);
        return $response;
    }

    public function GetArea4ByArea3(RefZipcodeInterface $refZipcodeInterface, GetRefZipcodeByAreaRequest $request)
    {
        $response = $refZipcodeInterface->GetArea4ByArea3($request);
        return $response;
    }

    public function GetRefZipcodeIdByArea4AndArea3(RefZipcodeInterface $refZipcodeInterface, GetRefZipcodeIdByArea3AndArea4 $request)
    {
        $response = $refZipcodeInterface->GetRefZipcodeIdByArea4AndArea3($request);
        return $response;
    }
    
}
