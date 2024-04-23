<?php

namespace App\Http\Services;

use App\Models\Promo;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use App\Http\Interfaces\PromoInterface;
use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\RefAttractionIdRequest;
use App\Http\Requests\V2\RefHotelIdRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;

class PromoService implements PromoInterface
{
    #region Private Function
    private function getPromoByCode($promo_code)
    {
        $promo = Promo::where('promo_code', $promo_code)->first();
        return $promo;
    }

    private function createPromo($request)
    {
        $promo = new Promo();
        $promo->promo_code = $request->promo_code;
        $promo->start_date = $request->start_date;
        $promo->end_date = $request->end_date;
        $promo->is_hotel = $request->is_hotel;
        $promo->is_vehicle = $request->is_vehicle;
        $promo->is_attraction = $request->is_attraction;
        $promo->is_amount = $request->is_amount;
        $promo->amount = $request->amount;
        $promo->percent = $request->percent;
        $promo->save();

        return $promo;
    }

    private function calculateNewPrice($base_price, $promo)
    {
        $newPrice = 0;

        if($promo->is_amount == true)
        {
            $newPrice = $base_price - $promo->amount;
        }
        else
        {
            $newPrice = $base_price - ($base_price * $promo->percent / 100);
        }

        return $newPrice;
    }

    private function getRefAttractionWithPriceById($ref_attraction_id)
    {   
        $attraction = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        select('ref_attractions.ref_attraction_id', 'ref_attractions.promo_code', 'agency_affiliates.base_price')->
        where('ref_attractions.ref_attraction_id', $ref_attraction_id)->
        first();

        return $attraction;
    }

    private function getRefHotelWithPriceById($ref_hotel_id)
    {   
        $hotel = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        select('ref_hotels.ref_hotel_id', 'ref_hotels.promo_code', 'agency_affiliates.base_price')->
        where('ref_hotels.ref_hotel_id', $ref_hotel_id)->
        first();

        return $hotel;
    }

    private function getRefVehicleWithPriceById($ref_vehicle_id)
    {   
        $vehicle = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        select('ref_vehicles.ref_vehicle_id', 'ref_vehicles.promo_code', 'agency_affiliates.base_price')->
        where('ref_vehicles.ref_vehicle_id', $ref_vehicle_id)->
        first();

        return $vehicle;
    }

    private function getPackageHById($package_h_id)
    {
        $packageH = PackageH::where('package_h_id', $package_h_id)->first();

        return $packageH;
    }
    
    #endregion

    #region Public Function
    public function AddPromo(StorePromoRequest $request)
    {
        try
        {
            $promo = $this->getPromoByCode($request->promo_code);

            if($promo != null)
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Promo code already exist",
                    'promo_id' => "-"
                ], 400);
            }
            else
            {
                $promo = $this->createPromo($request);

                return response()->json([
                    'status' => "success",
                    'message' => "Promo created successfully",
                    'promo_id' => $promo->promo_id
                ], 200);
            }
        }
        catch(\Exception $e)
        {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'promo_id' => "-"
            ], 500);
        }
    }

    public function GetPromoDeductionPriceAttraction(RefAttractionIdRequest $request)
    {
        $attraction = $this->getRefAttractionWithPriceById($request->ref_attraction_id);

        $promo = $this->getPromoByCode($attraction->promo_code);

        if($promo != null && $promo->is_attraction == true)
        {
            $newPrice = $this->calculateNewPrice($attraction->base_price, $promo);

            return response()->json([
                'status' => "success",
                'message' => "Promo found",
                'new_price' => $newPrice
            ]);
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Promo not found",
                'new_price' => "-",
            ]);
        }
        
    }

    public function GetPromoDeductionPriceHotel(RefHotelIdRequest $request)
    {
        $hotel = $this->getRefHotelWithPriceById($request->ref_hotel_id);

        $promo = $this->getPromoByCode($hotel->promo_code);

        if($promo != null && $promo->is_hotel == true)
        {
            $newPrice = $this->calculateNewPrice($hotel->base_price, $promo);

            return response()->json([
                'status' => "success",
                'message' => "Promo found",
                'new_price' => $newPrice
            ]);
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Promo not found",
                'new_price' => "-"
            ]);
        }
        
    }

    public function GetPromoDeductionPriceVehicle(RefVehicleIdRequest $request)
    {
        $vehicle = $this->getRefVehicleWithPriceById($request->ref_vehicle_id);

        $promo = $this->getPromoByCode($vehicle->promo_code);

        if($promo != null && $promo->is_vehicle == true)
        {
            $newPrice = $this->calculateNewPrice($vehicle->base_price, $promo);

            return response()->json([
                'status' => "success",
                'message' => "Promo found",
                'new_price' => $newPrice
            ]);
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Promo not found",
                'new_price' => "-"
            ]);
        }
        
    }

    public function GetPromoDeductionPricePackage(PackageHIdRequest $request)
    {
        $package = $this->getPackageHById($request->package_h_id);

        $promo = $this->getPromoByCode($package->promo_code);

        if($promo != null && $promo->is_package == true)
        {
            $newPrice = $this->calculateNewPrice($package->package_price, $promo);

            return response()->json([
                'status' => "success",
                'message' => "Promo found",
                'new_price' => $newPrice
            ]);
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Promo not found",
                'new_price' => "-"
            ]);
        }
    }
    #endregion
}