<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\SearchBarCustomerRequest;

interface AgencyAffiliateInterface
{
    public function GetSearchHomepageCustomerData(SearchBarCustomerRequest $request);

    public function SearchAttractionCustomer(SearchBarCustomerRequest $request);

    public function SearchHotelCustomer(SearchBarCustomerRequest $request);

    public function SearchVehicleCustomer(SearchBarCustomerRequest $request);

    public function GetAgencyByAgencyId(AgencyIdRequest $request);
}