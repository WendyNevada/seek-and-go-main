<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Services\PromoService;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\PromoDeductionRequest;

class PromoController extends Controller
{
    public function AddPromo(PromoService $promoService, StorePromoRequest $request)
    {
        $response = $promoService->AddPromo($request);

        return $response;
    }

    public function GetPromoDeductionPriceAttraction(PromoService $promoService, PromoDeductionRequest $request)
    {
        $response = $promoService->GetPromoDeductionPriceAttraction($request);

        return $response;
    }

    public function GetPromoDeductionPriceHotel(PromoService $promoService, PromoDeductionRequest $request)
    {
        $response = $promoService->GetPromoDeductionPriceHotel($request);

        return $response;
    }

    public function GetPromoDeductionPriceVehicle(PromoService $promoService, PromoDeductionRequest $request)
    {
        $response = $promoService->GetPromoDeductionPriceVehicle($request);

        return $response;
    }

    public function AddPromoCounterHistory(PromoService $promoService, PromoDeductionRequest $request)
    {
        $response = $promoService->AddPromoCounterHistory($request);
        return $response;
    }

}
