<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy2AreaRequest;
use App\Http\Requests\V2\GetRefZipcodeBy3AreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

interface RefZipcodeInterface
{
    public function GetAllArea1();

    public function GetArea2ByArea1(GetRefZipcodeByAreaRequest $request);

    public function GetArea3ByArea2AndArea1(GetRefZipcodeBy2AreaRequest $request);

    public function GetArea4ByArea3AndArea2AndArea1(GetRefZipcodeBy3AreaRequest $request);
}