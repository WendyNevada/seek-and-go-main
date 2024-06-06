<?php

namespace App\Http\Controllers\API\V1;

use App\Models\PackageH;
use App\Http\Controllers\Controller;
use App\Http\Services\PackageHService;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\EditPackageAgencyRequest;
use App\Http\Requests\V2\CreatePackageAgencyRequest;
use App\Http\Requests\V2\ApproveCustomPackageRequest;
use App\Http\Requests\V2\GetCustomPackageAgencyRequest;
use App\Http\Requests\V2\GetCustomPackageCustomerRequest;
use App\Http\Requests\V2\CreateCustomPackageCustomerRequest;

class PackageHController extends Controller
{
    public function CreatePackageAgency(PackageHService $packageHService, CreatePackageAgencyRequest $request)
    {
        $response = $packageHService->CreatePackageAgency($request);
        return $response;
    }

    public function EditPackageAgency(PackageHService $packageHService, EditPackageAgencyRequest $request)
    {
        $response = $packageHService->EditPackageAgency($request);
        return $response;
    }

    public function DeactivatePackageAgency(PackageHService $packageHService, PackageHIdRequest $request)
    {
        $response = $packageHService->DeactivatePackageAgency($request);
        return $response;
    }

    public function CreateCustomPackageCustomer(PackageHService $packageHService, CreateCustomPackageCustomerRequest $request)
    {
        $response = $packageHService->CreateCustomPackageCustomer($request);
        return $response;
    }

    public function GetCustomPackageByCustomerId(PackageHService $packageHService, GetCustomPackageCustomerRequest $request)
    {
        $response = $packageHService->GetCustomPackageByCustomerId($request);
        return $response;
    }

    public function GetCustomPackageByAgencyId(PackageHService $packageHService, GetCustomPackageAgencyRequest $request)
    {
        $response = $packageHService->GetCustomPackageByAgencyId($request);
        return $response;
    }

    public function GetNewCustomPackageByAgencyId(PackageHService $packageHService, GetCustomPackageAgencyRequest $request)
    {
        $response = $packageHService->GetNewCustomPackageByAgencyId($request);
        return $response;
    }

    public function GetApvCustomPackageByAgencyId(PackageHService $packageHService, AgencyIdRequest $request)
    {
        $response = $packageHService->GetApvCustomPackageByAgencyId($request);
        return $response;
    }

    public function ApproveCustomPackage(PackageHService $packageHService, ApproveCustomPackageRequest $request)
    {
        $response = $packageHService->ApproveCustomPackage($request);
        return $response;
    }

    public function RejectCustomPackage(PackageHService $packageHService, PackageHIdRequest $request)
    {
        $response = $packageHService->RejectCustomPackage($request);
        return $response;
    }

    public function GetActivePackageHByAgencyId(PackageHService $packageHService, AgencyIdRequest $request)
    {
        $response = $packageHService->GetActivePackageHByAgencyId($request);
        return $response;
    }

    public function GetPackageDataById(PackageHService $packageHService, PackageHIdRequest $request)
    {
        $response = $packageHService->GetPackageDataById($request);
        return $response;
    }

    public function GetListAttractionForAgencyPackage(PackageHService $packageHService, AgencyIdRequest $request)
    {
        $response = $packageHService->GetListAttractionForAgencyPackage($request);
        return $response;
    }

    public function GetListHotelForAgencyPackage(PackageHService $packageHService, AgencyIdRequest $request)
    {
        $response = $packageHService->GetListHotelForAgencyPackage($request);
        return $response;
    }

    public function GetListVehicleForAgencyPackage(PackageHService $packageHService, AgencyIdRequest $request)
    {
        $response = $packageHService->GetListVehicleForAgencyPackage($request);
        return $response;
    }

    public function GetAgencyPackagesHomepage(PackageHService $packageHService)
    {
        $response = $packageHService->GetAgencyPackagesHomepage();
        return $response;
    }
}
