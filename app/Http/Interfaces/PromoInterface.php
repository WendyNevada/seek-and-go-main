<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\PromoDeductionRequest;

interface PromoInterface 
{
    public function AddPromo(StorePromoRequest $request);

    public function GetPromoDeductionPriceAttraction(PromoDeductionRequest $request);

    public function GetPromoDeductionPriceHotel(PromoDeductionRequest $request);

    public function GetPromoDeductionPriceVehicle(PromoDeductionRequest $request);

    public function AddPromoCounterHistory(PromoDeductionRequest $request);
}