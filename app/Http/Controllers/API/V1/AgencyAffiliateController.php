<?php

namespace App\Http\Controllers\API\V1;

use App\Models\AgencyAffiliate;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\AgencyAffiliateInterface;
use App\Http\Requests\V2\SearchBarCustomerRequest;
use App\Http\Requests\V1\StoreAgencyAffiliateRequest;
use App\Http\Requests\V1\UpdateAgencyAffiliateRequest;

class AgencyAffiliateController extends Controller
{
    public function GetSearchHomepageCustomerData(AgencyAffiliateInterface $agencyAffiliate, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliate->getSearchHomepageCustomerData($request);
        return $response;
    }

    public function SearchAttractionCustomer(AgencyAffiliateInterface $agencyAffiliate, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliate->SearchAttractionCustomer($request);
        return $response;
    }

    public function SearchHotelCustomer(AgencyAffiliateInterface $agencyAffiliate, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliate->SearchHotelCustomer($request);
        return $response;
    }

    public function SearchVehicleCustomer(AgencyAffiliateInterface $agencyAffiliate, SearchBarCustomerRequest $request)
    {
        $response = $agencyAffiliate->SearchVehicleCustomer($request);
        return $response;
    }
}
