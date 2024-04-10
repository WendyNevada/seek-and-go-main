<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V1\StoreRefAttractionRequest;
use App\Http\Requests\V1\UpdateRefAttractionRequest;
use App\Http\Requests\V2\GetRefAttractionByCodeRequest;
use App\Http\Requests\V2\GetRefAttractionByIdRequest;

interface RefAttractionInterface
{
    public function GetAttractionByCode(GetRefAttractionByCodeRequest $request);

    public function GetAttractionById(GetRefAttractionByIdRequest $request);

    public function AddAttraction(StoreRefAttractionRequest $request);

    public function EditAttractionById(UpdateRefAttractionRequest $request);

    public function GetAttractionHomepage();
}