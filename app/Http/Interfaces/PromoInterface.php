<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;

interface PromoInterface 
{
    public function AddPromo(StorePromoRequest $request);

    public function GetPromoDeductionPriceAttraction(RefAttractionIdRequest $request);

    public function GetPromoDeductionPriceHotel(RefHotelIdRequest $request);

    public function GetPromoDeductionPriceVehicle(RefVehicleIdRequest $request);

    public function GetPromoDeductionPricePackage(PackageHIdRequest $request);
}