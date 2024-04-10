<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\GetRefZipcodeByAreaRequest;
use App\Http\Requests\V2\GetRefZipcodeIdByArea3AndArea4;

interface RefZipcodeInterface
{
    public function GetAllArea1();

    public function GetArea2ByArea1(GetRefZipcodeByAreaRequest $request);

    public function GetArea3ByArea2(GetRefZipcodeByAreaRequest $request);

    public function GetArea4ByArea3(GetRefZipcodeByAreaRequest $request);

    public function GetRefZipcodeIdByArea4AndArea3(GetRefZipcodeIdByArea3AndArea4 $request);
}