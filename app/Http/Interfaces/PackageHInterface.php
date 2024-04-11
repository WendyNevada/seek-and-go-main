<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V1\StorePackageHRequest;
use App\Http\Requests\V1\UpdatePackageHRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

interface PackageHInterface
{
    public function CreatePackageAgency(CreatePackageAgencyRequest $request);

    public function CreateCustomPackageCustomer(CreateCustomPackageCustomerRequest $request);
}