<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Promo;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\PromoInterface;
use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V1\UpdatePromoRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;

class PromoController extends Controller
{
    public function AddPromo(PromoInterface $promoInterface, StorePromoRequest $request)
    {
        $response = $promoInterface->AddPromo($request);

        return $response;
    }

    public function GetPromoDeductionPriceAttraction(PromoInterface $promoInterface, RefAttractionIdRequest $request)
    {
        $response = $promoInterface->GetPromoDeductionPriceAttraction($request);

        return $response;
    }

    public function GetPromoDeductionPriceHotel(PromoInterface $promoInterface, RefHotelIdRequest $request)
    {
        $response = $promoInterface->GetPromoDeductionPriceHotel($request);

        return $response;
    }

    public function GetPromoDeductionPriceVehicle(PromoInterface $promoInterface, RefVehicleIdRequest $request)
    {
        $response = $promoInterface->GetPromoDeductionPriceVehicle($request);

        return $response;
    }

    public function GetPromoDeductionPricePackage(PromoInterface $promoInterface, PackageHIdRequest $request)
    {
        $response = $promoInterface->GetPromoDeductionPricePackage($request);

        return $response;
    }

}
