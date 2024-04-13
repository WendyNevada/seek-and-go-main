<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;

interface RefAttractionInterface
{
    public function GetAttractionByCode(GetRefAttractionByCodeRequest $request);

    public function GetAttractionById(GetRefAttractionByIdRequest $request);

    public function AddAttraction(StoreRefAttractionRequest $request);

    public function EditAttractionById(UpdateRefAttractionRequest $request);

    public function GetAttractionHomepage();

    public function GetActiveAttractionByAgencyId(AgencyIdRequest $request);
}