<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V1\StorePackageHRequest;
use App\Http\Requests\V1\UpdatePackageHRequest;
use App\Http\Requests\V2\EditPackageAgencyRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\ApproveCustomPackageRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

interface PackageHInterface
{
    public function CreatePackageAgency(CreatePackageAgencyRequest $request);

    public function DeactivatePackageAgency(PackageHIdRequest $request);

    public function CreateCustomPackageCustomer(CreateCustomPackageCustomerRequest $request);

    public function GetNewCustomPackageByAgencyId(AgencyIdRequest $request);

    public function GetApvCustomPackageByAgencyId(AgencyIdRequest $request);

    public function ApproveCustomPackage(ApproveCustomPackageRequest $request);

    public function GetActivePackageHByAgencyId(AgencyIdRequest $request);

    public function GetPackageDataById(PackageHIdRequest $request);

    public function GetListAttractionForAgencyPackage(AgencyIdRequest $request);

    public function GetListHotelForAgencyPackage(AgencyIdRequest $request);

    public function GetListVehicleForAgencyPackage(AgencyIdRequest $request);

    public function EditPackageAgency(EditPackageAgencyRequest $request);
}