<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\AgencyPaymentIdRequest;
use App\Http\Requests\V1\StoreAgencyPaymentRequest;
use App\Http\Requests\V1\UpdateAgencyPaymentRequest;

interface AgencyPaymentInterface
{
    public function GetAllAgencyPaymentByAgencyId(AgencyIdRequest $request);

    public function InsertAgencyPayment(StoreAgencyPaymentRequest $request);

    public function EditAgencyPayment(UpdateAgencyPaymentRequest $request);

    public function RemoveAgencyPayment(AgencyPaymentIdRequest $request);
}