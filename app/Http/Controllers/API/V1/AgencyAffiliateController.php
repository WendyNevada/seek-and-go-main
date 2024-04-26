<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use App\Http\Services\AgencyAffiliateService;
use App\Http\Requests\V2\SearchBarCustomerRequest;

class AgencyAffiliateController extends Controller
{
    public function GetSearchHomepageCustomerData(AgencyAffiliateService $agencyAffiliateService, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliateService->getSearchHomepageCustomerData($request);
        return $response;
    }

    public function SearchAttractionCustomer(AgencyAffiliateService $agencyAffiliateService, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliateService->SearchAttractionCustomer($request);
        return $response;
    }

    public function SearchHotelCustomer(AgencyAffiliateService $agencyAffiliateService, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliateService->SearchHotelCustomer($request);
        return $response;
    }

    public function SearchVehicleCustomer(AgencyAffiliateService $agencyAffiliateService, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliateService->SearchVehicleCustomer($request);
        return $response;
    }
}
