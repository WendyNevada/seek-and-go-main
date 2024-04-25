<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V1\StoreRefHotelRequest;
use App\Http\Requests\V1\UpdateRefHotelRequest;
use App\Http\Requests\V2\GetRefHotelByIdRequest;

interface RefHotelInterface
{
    public function GetHotelById(GetRefHotelByIdRequest $request);

    public function AddHotel(StoreRefHotelRequest $request);

    public function EditHotelById(UpdateRefHotelRequest $request);

    public function DeactivateHotelById(RefHotelIdRequest $request);

    public function GetHotelHomepage();

    public function GetActiveHotelByAgencyId(AgencyIdRequest $request);

    public function RateHotel(RateProductRequest $request);
}