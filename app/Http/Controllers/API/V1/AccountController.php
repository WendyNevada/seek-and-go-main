<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Interfaces\AccountInterface;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V1\UpdateAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;
use App\Http\Requests\V2\CheckEmailRequest;
use App\Http\Requests\V2\LoginRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Http\Resources\V1\CheckEmailResource;
use App\Models\Agency;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Account::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function CreateAccountCustomer(AccountInterface $accountInterface, StoreAccountRequest $request)
    {
        $response = $accountInterface->CreateAccountCustomer($request);
        return $response;
    }

    public function CreateAccountAgency(AccountInterface $accountInterface, StoreAccountAgencyRequest $request)
    {
        $response = $accountInterface->CreateAccountAgency($request);
        return $response;
    }

    public function Login(AccountInterface $accountInterface, LoginRequest $request)
    {
        $response = $accountInterface->Login($request);
        return $response;
    }

    public function UpdateCustomerAccount(AccountInterface $accountInterface, UpdateCustomerAccountRequest $request)
    {
        $response = $accountInterface->UpdateCustomerAccount($request);
        return $response;
    }

    public function UpdateAgencyAccount(AccountInterface $accountInterface, UpdateAgencyAccountRequest $request)
    {
        $response = $accountInterface->UpdateAgencyAccount($request);
        return $response;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccountRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        //
    }

    public function showId($id)
    {
        return Account::where('account_id', $id)->first();
    }

    public function checkEmail(CheckEmailRequest $request)
    {
        $account = Account::where('email', $request->email)->first();

        if($account != null)
        {
            return new CheckEmailResource($account);
        }
        else
        {
            return ["tidak ada"];
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccountRequest $request, Account $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        //
    }
}
