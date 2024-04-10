<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V1\StorePackageHRequest;
use App\Http\Requests\V1\UpdatePackageHRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;

interface PackageHInterface
{
    public function CreatePackageAgency(CreatePackageAgencyRequest $request);
}