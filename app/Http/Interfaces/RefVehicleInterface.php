<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\RateProductRequest;
use App\Http\Requests\V2\RefVehicleIdRequest;
use App\Http\Requests\V1\StoreRefVehicleRequest;
use App\Http\Requests\V1\UpdateRefVehicleRequest;
use App\Http\Requests\V2\GetRefVehicleByIdRequest;

interface RefVehicleInterface
{
    public function AddVehicle(StoreRefVehicleRequest $request);

    public function EditVehicleById(UpdateRefVehicleRequest $request);

    public function DeactivateVehicleById(RefVehicleIdRequest $request);

    public function GetVehicleById(GetRefVehicleByIdRequest $request);

    public function GetVehicleHomepage();

    public function GetActiveVehicleByAgencyId(AgencyIdRequest $request);

    public function GetActiveVehicleByAgencyIdWithoutQty(AgencyIdRequest $request);

    public function RateVehicle(RateProductRequest $request);
}