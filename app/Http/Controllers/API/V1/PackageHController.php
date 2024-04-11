<?php

namespace App\Http\Controllers\API\V1;

use App\Models\PackageD;
use App\Models\PackageH;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\PackageHInterface;
use App\Http\Requests\V1\StorePackageHRequest;
use App\Http\Requests\V1\UpdatePackageHRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

class PackageHController extends Controller
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
    public function store(StorePackageHRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PackageH $packageH)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PackageH $packageH)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePackageHRequest $request, PackageH $packageH)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PackageH $packageH)
    {
        //
    }

    public function CreatePackageAgency(PackageHInterface $packageHInterface, CreatePackageAgencyRequest $request)
    {
        $response = $packageHInterface->CreatePackageAgency($request);
        return $response;
    }

    public function CreateCustomPackageCustomer(PackageHInterface $packageHInterface, CreateCustomPackageCustomerRequest $request)
    {
        $response = $packageHInterface->CreateCustomPackageCustomer($request);
        return $response;
    }
}
