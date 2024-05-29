<?php

namespace App\Http\Interfaces;

use App\Http\Requests\V2\LoginRequest;
use App\Http\Requests\V2\AccountIdRequest;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V1\UpdateAccountRequest;
use App\Http\Requests\V2\ForgotPasswordRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;

interface AccountInterface {

    public function GetAccountInfoById(AccountIdRequest $request);

    public function Login(LoginRequest $request);

    public function CreateAccountCustomer(StoreAccountRequest $request);

    public function CreateAccountAgency(StoreAccountAgencyRequest $request);

    public function UpdateCustomerAccount(UpdateCustomerAccountRequest $request);

    public function UpdateAgencyAccount(UpdateAgencyAccountRequest $request);

    public function ForgotPasswordRequest(ForgotPasswordRequest $request);

    public function ResetPassword(ForgotPasswordRequest $request);

}