<?php

namespace App\Http\Services;

use App\Models\Agency;
use App\Models\RefHotel;
use App\Models\RefVehicle;
use App\Models\RefAttraction;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Interfaces\AgencyAffiliateInterface;
use App\Http\Requests\V2\SearchBarCustomerRequest;

class AgencyAffiliateService implements AgencyAffiliateInterface
{
    #region Private Function
    private function getAttractionByKeyword($keyword)
    {
        $attraction = RefAttraction::
        where('ref_attractions.is_active', true)->
        where('ref_attractions.attraction_name', 'like', "%$keyword%")->
        select(
            'ref_attractions.ref_attraction_id as id',
            'ref_attractions.attraction_name as name'
        )->
        limit(3)->
        get();

        return $attraction;
    }

    private function getHotelByKeyword($keyword)
    {
        $hotel = RefHotel::
        where('ref_hotels.is_active', true)->
        where('ref_hotels.hotel_name', 'like', "%$keyword%")->
        select(
            'ref_hotels.ref_hotel_id as id',
            'ref_hotels.hotel_name as name'
        )->
        limit(3)->
        get();

        return $hotel;
    }

    private function getVehicleByKeyword($keyword)
    {
        $vehicle = RefVehicle::
        where('ref_vehicles.is_active', true)->
        where('ref_vehicles.vehicle_name', 'like', "%$keyword%")->
        select(
            'ref_vehicles.ref_vehicle_id as id',
            'ref_vehicles.vehicle_name as name'
        )->
        limit(3)->
        get();

        return $vehicle;
    }

    private function mergeDataQuery($data1, $data2)
    {
        return $data1->merge($data2);
    }

    private function getActiveAttractionByNameKeyword($keyword)
    {
        $attractionByName = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        leftjoin('ref_pictures', 'ref_attractions.ref_attraction_id', '=', 'ref_pictures.ref_attraction_id')->
        select('ref_attractions.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_attractions.is_active', true)->
        where('ref_attractions.attraction_name', 'like', "%$keyword%")->
        get();

        return $attractionByName;
    }

    private function getActiveAttractionByAddressKeyword($keyword)
    {
        $attractionByAddress = RefAttraction::
        join('agency_affiliates', 'ref_attractions.ref_attraction_id', '=', 'agency_affiliates.ref_attraction_id')->
        leftjoin('ref_pictures', 'ref_attractions.ref_attraction_id', '=', 'ref_pictures.ref_attraction_id')->
        join('ref_zipcodes', 'ref_attractions.ref_zipcode_id', '=', 'ref_zipcodes.ref_zipcode_id')->
        select('ref_attractions.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_attractions.is_active', true)->
        whereRaw('concat(ref_zipcodes.area_1, " ", ref_zipcodes.area_2, " ", ref_zipcodes.area_3, " ", ref_zipcodes.area_4, " ", ref_attractions.address) like ?', "%$keyword%")->
        get();

        return $attractionByAddress;
    }

    private function getActiveHotelByNameKeyword($keyword)
    {
        $hotelByName = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        leftjoin('ref_pictures', 'ref_hotels.ref_hotel_id', '=', 'ref_pictures.ref_hotel_id')->
        select('ref_hotels.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_hotels.is_active', true)->
        where('ref_hotels.hotel_name', 'like', "%$keyword%")->
        get();

        return $hotelByName;
    }

    private function getActiveHotelByAddressKeyword($keyword)
    {
        $hotelByAddress = RefHotel::
        join('agency_affiliates', 'ref_hotels.ref_hotel_id', '=', 'agency_affiliates.ref_hotel_id')->
        leftjoin('ref_pictures', 'ref_hotels.ref_hotel_id', '=', 'ref_pictures.ref_hotel_id')->
        join('ref_zipcodes', 'ref_hotels.ref_zipcode_id', '=', 'ref_zipcodes.ref_zipcode_id')->
        select('ref_hotels.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_hotels.is_active', true)->
        whereRaw('concat(ref_zipcodes.area_1, " ", ref_zipcodes.area_2, " ", ref_zipcodes.area_3, " ", ref_zipcodes.area_4, " ", ref_hotels.address) like ?', "%$keyword%")->
        get();

        return $hotelByAddress;
    }

    private function getActiveVehicleByNameKeyword($keyword)
    {
        $vehicleByName = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        leftjoin('ref_pictures', 'ref_vehicles.ref_vehicle_id', '=', 'ref_pictures.ref_vehicle_id')->
        select('ref_vehicles.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_vehicles.is_active', true)->
        where('ref_vehicles.vehicle_name', 'like', "%$keyword%")->
        get();

        return $vehicleByName;
    }

    private function getActiveVehicleByAddressKeyword($keyword)
    {
        $vehicleByAddress = RefVehicle::
        join('agency_affiliates', 'ref_vehicles.ref_vehicle_id', '=', 'agency_affiliates.ref_vehicle_id')->
        leftjoin('ref_pictures', 'ref_vehicles.ref_vehicle_id', '=', 'ref_pictures.ref_vehicle_id')->
        join('ref_zipcodes', 'ref_vehicles.ref_zipcode_id', '=', 'ref_zipcodes.ref_zipcode_id')->
        select('ref_vehicles.*', 'agency_affiliates.base_price', 'ref_pictures.image_url')->
        where('ref_vehicles.is_active', true)->
        whereRaw('concat(ref_zipcodes.area_1, " ", ref_zipcodes.area_2, " ", ref_zipcodes.area_3, " ", ref_zipcodes.area_4, " ", ref_vehicles.address) like ?', "%$keyword%")->
        get();

        return $vehicleByAddress;
    }

    private function checkDataEmpty($data)
    {
        if(count($data) == 0)
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

    private function getAgencyDataById($agency_id)
    {
        return Agency::where('agency_id', $agency_id)
        ->with(['agencyPayments' => function($q) {
            $q->leftJoin('ref_pictures', 'ref_pictures.agency_payment_id', '=', 'agency_payments.agency_payment_id');
            $q->select('agency_payments.*', 'ref_pictures.image_url');
            }])
        ->first();
    }

    private function getAllAgencyData()
    {
        return Agency::get();
    }

    private function getAgencyNameByKeyword($keyword)
    {
        $agency = Agency::
            where('agency_name', 'like', "%$keyword%")->
            get();

        return $agency;
    }

    private function getAgencyLocationByKeyword($keyword)
    {
        $agency = Agency::
            where('location', 'like', "%$keyword%")->
            get();

        return $agency;
    }
    #endregion

    #region Public Function
    public function GetSearchHomepageCustomerData(SearchBarCustomerRequest $request)
    {
        $attraction = $this->getAttractionByKeyword($request->keyword);

        $hotel = $this->getHotelByKeyword($request->keyword);

        $vehicle = $this->getVehicleByKeyword($request->keyword);

        if($this->checkDataEmpty($attraction) && $this->checkDataEmpty($hotel) && $this->checkDataEmpty($vehicle))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'attraction' => [],
                'hotel' => [],
                'vehicle' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'attraction' => $attraction,
                'hotel' => $hotel,
                'vehicle' => $vehicle
            ]);
        }
    }

    public function SearchAttractionCustomer(SearchBarCustomerRequest $request)  
    {

        $attractionByName = $this->getActiveAttractionByNameKeyword($request->keyword);

        $attractionByAddress = $this->getActiveAttractionByAddressKeyword($request->keyword);

        $attraction = $this->mergeDataQuery($attractionByName, $attractionByAddress);

        if($this->checkDataEmpty($attraction))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $attraction
            ]);
        }
    }

    public function SearchHotelCustomer(SearchBarCustomerRequest $request)
    {
        $hotelByName = $this->getActiveHotelByNameKeyword($request->keyword);

        $hotelByAddress = $this->getActiveHotelByAddressKeyword($request->keyword);

        $hotel = $this->mergeDataQuery($hotelByName, $hotelByAddress);

        if($this->checkDataEmpty($hotel))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $hotel
            ]);
        }
    }

    public function SearchVehicleCustomer(SearchBarCustomerRequest $request)
    {
        $vehicleByName = $this->getActiveVehicleByNameKeyword($request->keyword);

        $vehicleByAddress = $this->getActiveVehicleByAddressKeyword($request->keyword);

        $vehicle = $this->mergeDataQuery($vehicleByName, $vehicleByAddress);

        if($this->checkDataEmpty($vehicle))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $vehicle
            ]);
        }
    }

    public function GetAgencyByAgencyId(AgencyIdRequest $request)
    {
        $agency = $this->getAgencyDataById($request->agency_id);

        if($this->checkDataNull($agency))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $agency
            ]);
        }
    }

    public function GetAllAgencyForAgencyPage()
    {
        $agencies = $this->getAllAgencyData();

        if($this->checkDataEmpty($agencies))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $agencies
            ]);
        }
    }

    public function GetAllAgencySearchBar(SearchBarCustomerRequest $request)
    {
        $agencyName = $this->getAgencyNameByKeyword($request->keyword);

        $agencyLocation = $this->getAgencyLocationByKeyword($request->keyword);

        $agencies = $this->mergeDataQuery($agencyName, $agencyLocation);

        if($this->checkDataEmpty($agencies))
        {
            return response()->json([
                'status' => "error",
                'message' => "Data not found",
                'data' => []
            ]);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "Success",
                'data' => $agencies
            ]);
        }
    }
    #endregion
}