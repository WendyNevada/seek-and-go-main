<?php

namespace App\Http\Services;

use App\Models\Promo;
use App\Models\PackageH;
use App\Models\RefHotel;
use App\Models\RefVehicle;
use App\Models\PromoHistory;
use App\Models\RefAttraction;
use App\Http\Interfaces\PromoInterface;
use App\Http\Requests\V1\StorePromoRequest;
use App\Http\Requests\V2\PackageHIdRequest;
use App\Http\Requests\V2\PromoDeductionRequest;
use App\Models\Constanta;
use Illuminate\Support\Facades\DB;

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
        $promo->max_use = $request->max_use;
        $promo->save();

        return $promo;
    }

    private function calculateNewPrice($base_price, $promo, $qty = null, &$unit_price)
    {
        $newPrice = 0;

        $unit_price = $base_price;

        if($qty != null)
        {
            $base_price = $base_price * $qty;
        }

        if($promo->is_amount == true)
        {
            $newPrice = $base_price - $promo->amount;
            $unit_price = $unit_price - $promo->amount;
        }
        else
        {
            $newPrice = $base_price - ($base_price * $promo->percent / 100);
            $unit_price = $unit_price - ($unit_price * $promo->percent / 100);
        }

        return $newPrice;
    }

    private function getRefAttractionWithPriceById($ref_attraction_id)
    {   
        $attraction = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        select('ref_attractions.ref_attraction_id', 'agency_affiliates.promo_code', 'agency_affiliates.base_price')->
        where('ref_attractions.ref_attraction_id', $ref_attraction_id)->
        first();

        return $attraction;
    }

    private function getRefHotelWithPriceById($ref_hotel_id)
    {   
        $hotel = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        select('ref_hotels.ref_hotel_id', 'agency_affiliates.promo_code', 'agency_affiliates.base_price')->
        where('ref_hotels.ref_hotel_id', $ref_hotel_id)->
        first();

        return $hotel;
    }

    private function getRefVehicleWithPriceById($ref_vehicle_id)
    {   
        $vehicle = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        select('ref_vehicles.ref_vehicle_id', 'agency_affiliates.promo_code', 'agency_affiliates.base_price')->
        where('ref_vehicles.ref_vehicle_id', $ref_vehicle_id)->
        first();

        return $vehicle;
    }

    private function getPackageHById($package_h_id)
    {
        $packageH = PackageH::where('package_h_id', $package_h_id)->first();

        return $packageH;
    }

    private function getPromoHistoryByPromoIdAndCustomerId($promo_id, $customer_id)
    {
        $promoHistory = PromoHistory::where('promo_id', $promo_id)->where('customer_id', $customer_id)->first();
        return $promoHistory;
    }
    
    private function insertPromoHistory($promo_id, $customer_id)
    {
        $promoHistory = new PromoHistory();
        $promoHistory->promo_id = $promo_id;
        $promoHistory->customer_id = $customer_id;
        $promoHistory->counter += 1;
        $promoHistory->save();
    }

    private function updatePromoHistory($promo_id, $customer_id)
    {
        $promoHistory = PromoHistory::where('promo_id', $promo_id)->where('customer_id', $customer_id)->first();
        $promoHistory->counter += 1;
        $promoHistory->save();
    }

    private function checkPromoHistoryCounter($promo_id, $customer_id, $max_use)
    {
        $promoHistory = PromoHistory::where('promo_id', $promo_id)->where('customer_id', $customer_id)->first();

        if($promoHistory == null)
        {
            return false;
        }
        else
        {
            if($promoHistory->counter >= $max_use)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    private function getPromoWithValidity($promo_code, $type)
    {
        $promo = Promo::where('promo_code', $promo_code)->first();

        if($promo != null)
        {
            if($promo->start_date <= date('Y-m-d') && $promo->end_date >= date('Y-m-d'))
            {
                if($promo->is_hotel == true && $type == Constanta::$hotel)
                {
                    return $promo;
                }
                else if($promo->is_vehicle == true && $type == Constanta::$vehicle)
                {
                    return $promo;
                }
                else if($promo->is_attraction == true && $type == Constanta::$attraction)
                {
                    return $promo;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    }

    private function deducePrice($price_1, $price_2, $qty = null)
    {
        if($qty != null)
        {
            return ($price_1 * $qty) - $price_2;
        }
        else
        {
            return $price_1 - $price_2;
        }
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

    public function GetPromoDeductionPriceAttraction(PromoDeductionRequest $request)
    {
        try
        {
            $attraction = $this->getRefAttractionWithPriceById($request->id);

            $promo = $this->getPromoWithValidity($request->promo_code, Constanta::$attraction);

            if($promo != null)
            {
                if($this->checkPromoHistoryCounter($promo->promo_id, $request->customer_id, $promo->max_use) == true)
                {
                    return response()->json([
                        'status' => "error",
                        'message' => "Max use reached",
                        'new_price' => "-",
                        'price_deduced' => "-",
                        'promo_type' => "-",
                        'promo_value' => "-",
                        'price_reduced_per_unit' => "-"
                    ]);
                }

                $unit_price = 0;

                $newPrice = $this->calculateNewPrice($attraction->base_price, $promo, $request->qty, $unit_price);

                $priceDeduced = $this->deducePrice($attraction->base_price, $newPrice, $request->qty);

                if($promo->is_amount == false)
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "percent",
                        'promo_value' => $promo->percent,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
                else
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "amount",
                        'promo_value' => $promo->amount,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Promo is not valid",
                    'new_price' => "-",
                    'price_deduced' => "-",
                    'promo_type' => "-",
                    'promo_value' => "-",
                    'price_reduced_per_unit' => "-"
                ]);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'new_price' => "-",
                'price_deduced' => "-",
                'price_reduced_per_unit => "-"'
            ], 500);
        }
    }

    public function GetPromoDeductionPriceHotel(PromoDeductionRequest $request)
    {
        try
        {
            $hotel = $this->getRefHotelWithPriceById($request->id);

            $promo = $this->getPromoWithValidity($request->promo_code, Constanta::$hotel);

            if($promo != null)
            {
                if($this->checkPromoHistoryCounter($promo->promo_id, $request->customer_id, $promo->max_use) == true)
                {
                    return response()->json([
                        'status' => "error",
                        'message' => "Max use reached",
                        'new_price' => "-",
                        'price_deduced' => "-",
                        'promo_type' => "-",
                        'promo_value' => "-",
                        'price_reduced_per_unit' => "-"
                    ]);
                }

                $unit_price = 0;
                
                $newPrice = $this->calculateNewPrice($hotel->base_price, $promo, $request->qty, $unit_price);

                $priceDeduced = $this->deducePrice($hotel->base_price, $newPrice, $request->qty);

                if($promo->is_amount == false)
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "percent",
                        'promo_value' => $promo->percent,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
                else
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "amount",
                        'promo_value' => $promo->amount,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Promo is not valid",
                    'new_price' => "-",
                    'price_deduced' => "-",
                    'promo_type' => "-",
                    'promo_value' => "-",
                    'price_reduced_per_unit' => "-"
                ]);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'new_price' => "-",
                'price_deduced' => "-",
                'promo_type' => "-",
                'promo_value' => "-",
                'price_reduced_per_unit' => "-"
            ], 500);
        }
    }

    public function GetPromoDeductionPriceVehicle(PromoDeductionRequest $request)
    {
        try
        {
            $vehicle = $this->getRefVehicleWithPriceById($request->id);

            $promo = $this->getPromoWithValidity($request->promo_code, Constanta::$vehicle);

                if($promo != null)
                {
                    if($this->checkPromoHistoryCounter($promo->promo_id, $request->customer_id, $promo->max_use) == true)
                    {
                        return response()->json([
                            'status' => "error",
                            'message' => "Max use reached",
                            'new_price' => "-",
                            'price_deduced' => "-",
                            'promo_type' => "-",
                            'promo_value' => "-",
                            'price_reduced_per_unit' => "-"
                        ]);
                    }

                $unit_price = 0;

                $newPrice = $this->calculateNewPrice($vehicle->base_price, $promo, $request->qty, $unit_price);

                $priceDeduced = $this->deducePrice($vehicle->base_price, $newPrice, $request->qty);

                if($promo->is_amount == false)
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "percent",
                        'promo_value' => $promo->percent,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
                else
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "Promo found",
                        'new_price' => $newPrice,
                        'price_deduced' => $priceDeduced,
                        'promo_type' => "amount",
                        'promo_value' => $promo->amount,
                        'price_reduced_per_unit' => $unit_price
                    ]);
                }
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Promo is not valid",
                    'new_price' => "-",
                    'price_deduced' => "-",
                    'promo_type' => "-",
                    'promo_value' => "-",
                    'price_reduced_per_unit' => "-"
                ]);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'new_price' => "-",
                'price_deduced' => "-",
                'promo_type' => "-",
                'promo_value' => "-",
                'price_reduced_per_unit' => "-"
            ], 500);
        }
    }

    public function AddPromoCounterHistory(PromoDeductionRequest $request)
    {
        try
        {
            $promo = $this->getPromoByCode($request->promo_code);

            $promoHistory = $this->getPromoHistoryByPromoIdAndCustomerId($promo->promo_id, $request->customer_id);

            if($promoHistory == null)
            {
                DB::beginTransaction();

                $this->insertPromoHistory($promo->promo_id, $request->customer_id);

                DB::commit();
            }
            else
            {
                DB::beginTransaction();

                $this->updatePromoHistory($promo->promo_id, $request->customer_id);

                DB::commit();
            }

            return response()->json([
                'status' => "ok",
                'message' => "Promo counter updated"
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "ok",
                'message' => $e->getMessage()
            ]);
        }
    }
    #endregion
}