<?php

namespace App\Http\Services;

use App\Models\OrderH;
use App\Models\PackageH;
use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\RefVehicle;
use App\Models\RefZipcode;
use App\Models\AgencyAffiliate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\RefVehicleInterface;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;

class RefVehicleService implements RefVehicleInterface
{
    #region Private Function
    private function getRefVehicleByCode($vehicle_code)
    {
        $vehicle = RefVehicle::where('vehicle_code', $vehicle_code)->first();

        return $vehicle;
    }

    private function getRefVehicleById($ref_vehicle_id)
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        return $vehicle;
    }

    private function getRefPictureByVehicleId($ref_vehicle_id)
    {
        $vehiclePicture = RefPicture::where('ref_vehicle_id', $ref_vehicle_id)->first();

        return $vehiclePicture;
    }

    private function getAgencyAffiliateByVehicleId($ref_vehicle_id)
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_vehicle_id', $ref_vehicle_id)->first();

        return $agencyAffiliate;
    }

    private function getRefZipcodeById($ref_zipcode_id)
    {
        $refZipcode = RefZipcode::where('ref_zipcode_id', $ref_zipcode_id)->first();

        return $refZipcode;
    }

    private function getRefZipcodeIdByAllArea($area_1, $area_2, $area_3, $area_4)
    {
        $refZipcodeId = RefZipcode::
                    where('area_1', $area_1)->
                    where('area_2', $area_2)->
                    where('area_3', $area_3)->
                    where('area_4', $area_4)->
                    first()->ref_zipcode_id;

        return $refZipcodeId;
    }

    private function createVehicle($vehicle_code, $refZipcodeId, $vehicle_type, $vehicle_brand, $vehicle_series, $vehicle_model, $vehicle_seat, $vehicle_year, $vehicle_name, $description, $with_driver, $address, $rating, $qty): RefVehicle
    {
        $vehicle = RefVehicle::
                create(
                    [
                        'vehicle_code' => $vehicle_code,
                        'ref_zipcode_id' => $refZipcodeId,
                        'vehicle_type' => $vehicle_type,
                        'vehicle_brand' => $vehicle_brand,
                        'vehicle_series' => $vehicle_series,
                        'vehicle_model' => $vehicle_model,
                        'vehicle_seat' => $vehicle_seat,
                        'vehicle_year' => $vehicle_year,
                        'vehicle_name' => $vehicle_name,
                        'description' => $description,
                        'with_driver' => $with_driver,
                        'address' => $address,
                        'rating' => $rating,
                        'is_active' => true,
                        'qty' => $qty
                    ]
                );

        return $vehicle;
    }

    private function insertRefPictureVehicle($picture, $vehicle_code, $ref_vehicle_id): void
    {
        $image = $picture;
        $imageName =  $vehicle_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refVehiclePictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = new RefPicture();
        $refPicture->ref_vehicle_id = $ref_vehicle_id;
        $refPicture->image_url = $url;
        $refPicture->save();
    }

    private function insertAgencyAffiliateVehicle($ref_vehicle_id, $agency_id, $base_price, $promo_code): void
    {
        $affiliate = AgencyAffiliate::
                create(
                    [
                        'ref_vehicle_id' => $ref_vehicle_id,
                        'agency_id' => $agency_id,
                        'base_price' => $base_price,
                        'promo_code' => $promo_code
                    ]
                );
    }

    private function updatePriceAgencyAffiliateVehicle($ref_vehicle_id, $base_price, $promo_code): void
    {
        $agencyAffiliate = AgencyAffiliate::where('ref_vehicle_id', $ref_vehicle_id)->first();

        $agencyAffiliate->update(
            [
                'base_price' => $base_price,
                'promo_code' => $promo_code
            ]
        );
    }

    private function updateRefVehicle($ref_vehicle_id, $vehicle_type, $vehicle_brand, $vehicle_series, $vehicle_model, $vehicle_seat, $vehicle_year, $vehicle_name, $description, $with_driver, $address, $qty): void
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        $vehicle->update(
            [
                'vehicle_type' => $vehicle_type,
                'vehicle_brand' => $vehicle_brand,
                'vehicle_series' => $vehicle_series,
                'vehicle_model' => $vehicle_model,
                'vehicle_seat' => $vehicle_seat,
                'vehicle_year' => $vehicle_year,
                'vehicle_name' => $vehicle_name,
                'description' => $description,
                'with_driver' => $with_driver,
                'address' => $address,
                'qty' => $qty
            ]
        );
    }

    private function updateRefPictureVehicle($picture, $vehicle_code, $ref_vehicle_id)
    {
        $image = $picture;
        $imageName =  $vehicle_code . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$refVehiclePictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = RefPicture::where('ref_vehicle_id', $ref_vehicle_id)->first();
        if($refPicture != null)
        {
            $refPicture->image_url = $url;
            $refPicture->save();
        }
        else
        {
            $refPicture = new RefPicture();
            $refPicture->ref_vehicle_id = $ref_vehicle_id;
            $refPicture->image_url = $url;
            $refPicture->save();
        }
    }

    private function checkOrderForVehicle($ref_vehicle_id): bool
    {
        $orderHs = OrderH::with('orderDs')
                ->whereHas('orderDs', function ($query) use ($ref_vehicle_id) {
                    $query->where('ref_vehicle_id', $ref_vehicle_id);
                })
                ->whereIn('order_status', [
                    Constanta::$orderStatusNew,
                    Constanta::$orderStatusApproved,
                    Constanta::$orderStatusPaid,
                    Constanta::$orderStatusCustPaid,
                    Constanta::$orderStatusRetryPay
                ])
                ->get();

        if(count($orderHs) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkPackageForVehicle($ref_vehicle_id): bool
    {
        $packageHs = PackageH::with('packageDs')
                ->whereHas('packageDs', function ($query) use ($ref_vehicle_id) {
                    $query->where('ref_vehicle_id', $ref_vehicle_id);
                })
                ->where('is_active', true)
                ->get();

        if(count($packageHs) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function updateIsActiveVehicle($ref_vehicle_id, $status): void
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        $vehicle->update([
            'is_active' => $status
        ]);
    }

    private function getActiveVehicleDataSortedWithLimit($limit)
    {
        $vehicle = RefVehicle::
            join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_hotel_id')->
            select('ref_vehicles.*', 'agency_affiliates.base_price')->
            where('is_active', '1')->
            where('qty', '>', '0')->
            orderBy('rating', 'desc')->
            orderBy('updated_at', 'desc')->
            orderby('agency_affiliates.base_price', 'asc')->
            orderBy('qty', 'desc')->
            limit($limit)->get();

        foreach ($vehicle as $key => $value)
        {
            $picture = RefPicture::where('ref_vehicle_id', $value->ref_vehicle_id)->first();

            $base_price = AgencyAffiliate::where('ref_vehicle_id', $value->ref_vehicle_id)->first()->base_price;

            if($picture != null)
            {
                $image_url = $picture->image_url;
            }
            else
            {
                $image_url = "-";
            }

            $value->image_url = $image_url;
            $value->base_price = $base_price;
        }

        return $vehicle;
    }

    private function getActiveVehiclesByAgencyId($agency_id)
    {
        $vehicle = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        leftjoin('ref_pictures', 'ref_vehicles.ref_vehicle_id', '=', 'ref_pictures.ref_vehicle_id')->
        select('ref_vehicles.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_vehicles.is_active', true)->
        where('agency_affiliates.agency_id', $agency_id)->
        get();

        return $vehicle;
    }

    private function updateRating($ref_vehicle_id, $rating): void
    {
        $vehicle = RefVehicle::where('ref_vehicle_id', $ref_vehicle_id)->first();

        $vehicle->update([
            'rating' => $rating
        ]);
    }

    private function getAverage($numbers)
    {
        $sum = array_sum($numbers);
        $count = count($numbers);
        return $sum / $count;
    }

    private function checkDataEmpty($data)
    {
        if(empty($data))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkDataNull($data)
    {
        if($data == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region Public Function
    public function AddVehicle(StoreRefVehicleRequest $request)
    {
        try
        {
            $vehicleCheck = $this->getRefVehicleByCode($request->vehicle_code);

            if($vehicleCheck == null)
            {
                DB::beginTransaction();

                $refZipcodeId = $this->getRefZipcodeIdByAllArea($request->area_1, $request->area_2, $request->area_3, $request->area_4);

                $vehicle = $this->createVehicle(
                        $request->vehicle_code, 
                        $refZipcodeId, 
                        $request->vehicle_type,
                        $request->vehicle_brand,
                        $request->vehicle_series,
                        $request->vehicle_model,
                        $request->vehicle_seat,
                        $request->vehicle_year,
                        $request->vehicle_name,
                        $request->description,
                        $request->with_driver,
                        $request->address,
                        $request->rating,
                        $request->qty
                    );

                $refVehicleId = $vehicle->ref_vehicle_id;

                if($request->hasFile('picture'))
                {
                    $this->insertRefPictureVehicle($request->file('picture'), $request->vehicle_code, $refVehicleId);
                }

                $this->insertAgencyAffiliateVehicle($refVehicleId, $request->agency_id, $request->base_price, $request->promo_code);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Vehicle added successfully",
                    'ref_vehicle_id' => $refVehicleId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Vehicle code already exists",
                    'ref_vehicle_id' => "-"
                ], 400);
            }
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ], 500);
        }
    }

    public function EditVehicleById(UpdateRefVehicleRequest $request)
    {
        try
        {
            $vehicle = $this->getRefVehicleById($request->ref_vehicle_id);
            
            DB::beginTransaction();

            $this->updatePriceAgencyAffiliateVehicle($request->ref_vehicle_id, $request->base_price, $request->promo_code);

            $this->updateRefVehicle(
                $request->ref_vehicle_id,
                $request->vehicle_type,
                $request->vehicle_brand,
                $request->vehicle_series,
                $request->vehicle_model,
                $request->vehicle_seat,
                $request->vehicle_year,
                $request->vehicle_name,
                $request->description,
                $request->with_driver,
                $request->address,
                $request->qty
            );

            if($request->picture_url == null)
            {
                if($request->hasFile('picture'))
                {
                    $this->updateRefPictureVehicle($request->file('picture'), $request->vehicle_code, $request->ref_vehicle_id);
                }
            }

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "Vehicle edited successfully",
                'ref_vehicle_id' => $request->ref_vehicle_id
            ], 200);
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => "-"
            ], 500);
        }
    }

    public function DeactivateVehicleById(RefVehicleIdRequest $request) 
    {
        try
        {
            $vehicle = $this->getRefVehicleById($request->ref_vehicle_id);

            if($vehicle != null)
            {
                $orderHs = $this->checkOrderForVehicle($request->ref_vehicle_id);

                if($orderHs == true)
                {
                    return response()->json(
                        [
                            'status' => "error",
                            'message' => "Vehicle is in active order",
                            'ref_vehicle_id' => $request->ref_vehicle_id
                        ],
                        400
                    );
                }

                $packageHs = $this->checkPackageForVehicle($request->ref_vehicle_id);

                if($packageHs == true)
                {
                    return response()->json(
                        [
                            'status' => "error",
                            'message' => "Vehicle is in active package",
                            'ref_vehicle_id' => $request->ref_vehicle_id
                        ],
                        400
                    );
                }

                DB::beginTransaction();

                $this->updateIsActiveVehicle($request->ref_vehicle_id, false);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Deactivate success",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Data not found",
                    'ref_vehicle_id' => $request->ref_vehicle_id
                ], 400);
            }    
        }
        catch (\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => $request->ref_vehicle_id
            ], 500);
        }
    }

    public function GetVehicleById(GetRefVehicleByIdRequest $request)
    {
        $vehicle = $this->getRefVehicleById($request->ref_vehicle_id);

        $vehiclePicture = $this->getRefPictureByVehicleId($request->ref_vehicle_id);;

        $agencyAffiliate = $this->getAgencyAffiliateByVehicleId($request->ref_vehicle_id);

        $address = $this->getRefZipcodeById($vehicle->ref_zipcode_id);;

        if($this->checkDataNull($vehicle) == false)
        {
            if($this->checkDataNull($vehiclePicture) == false)
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'vehicle' => $vehicle,
                    'picture_url' => $vehiclePicture->image_url,
                    'base_price' => $agencyAffiliate->base_price,
                    'agency_id' => $agencyAffiliate->agency_id,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "ok",
                    'message' => "Success",
                    'vehicle' => $vehicle,
                    'picture_url' => "-",
                    'base_price' => $agencyAffiliate->base_price,
                    'agency_id' => $agencyAffiliate->agency_id,
                    'address' => $address->area_1.","." ".$address->area_2.","." ".$address->area_3.","." ".$address->area_4
                ], 200);
            }
        }
        else
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'vehicle' => "-",
                'picture_url' => "-",
                'base_price' => "-",
                'agency_id' => "-",
                'address' => "-"
            ], 400);
        }
    }

    public function GetVehicleHomepage()
    {
        $vehicle = $this->getActiveVehicleDataSortedWithLimit(Constanta::$homepageDataCount);

        if($this->checkDataEmpty($vehicle) == true)
        {
            return response()->json(
                [
                    'status' => "error",
                    'message' => "Data not found",
                    'data'=> []
                ]
                ,400
            );
        }
        else
        {
            return response()->json(
                [
                    'status' => "ok",
                    'message' => "Success",
                    'data'=> $vehicle
                ]
            );
        }
    }

    public function GetActiveVehicleByAgencyId(AgencyIdRequest $request)
    {
        $vehicle = $this->getActiveVehiclesByAgencyId($request->agency_id);

        return response()->json($vehicle);
    }

    public function RateVehicle(RateProductRequest $request)
    {
        try
        {
            DB::beginTransaction();

            $vehicle = $this->getRefVehicleById($request->id);

            if($vehicle->rating != null)
            {
                $ratingAvg = $this->getAverage([$vehicle->rating, $request->rating]);
                
                $this->updateRating($request->id, $ratingAvg);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Vehicle has been rated",
                    'ref_vehicle_id' => $request->id
                ], 200);
            }
            else
            { 
                $this->updateRating($request->id, $request->rating);

                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "Vehicle has been rated",
                    'ref_vehicle_id' => $request->id
                ], 200);
            }
        }
        catch (\Exception $e)
        {
            return response()->json([
                'status' => "error",
                'message' => $e->getMessage(),
                'ref_vehicle_id' => $request->id
            ], 500);
        }
    }
    #endregion
    
}