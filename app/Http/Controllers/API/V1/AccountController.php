<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V1\UpdateAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;
use App\Http\Requests\V2\CheckEmailRequest;
use App\Http\Requests\V2\LoginRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Resources\V1\CheckEmailResource;
use App\Models\Agency;
use App\Models\Customer;

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

    public function CreateAccountCustomer(StoreAccountRequest $request)
    {
        try
        {
            $account = Account::
                create(
                    [
                        'account_name' => $request->account_name,
                        'email' => $request->email,
                        'password' => $request->password,
                        'role' => $request->role,
                        'phone' => $request->phone
                    ]
                );
            
            $accountId = $account->id;

            $customer = Customer::
                create(
                    [
                        'account_id' => $accountId,
                        'customer_name' => $request->customer_name,
                        'gender' => $request->gender,
                        'birth_date' => $request->birth_date
                    ]
                );

            $message = "success";

            return [
                'status' => "ok",
                'message' => $message
            ];
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return [
                'status' => "error",
                'message' => $message
            ];
        }
    }

    public function CreateAccountAgency(StoreAccountAgencyRequest $request)
    {
        try
        {
            $account = Account::
                create(
                    [
                        'account_name' => $request->account_name,
                        'email' => $request->email,
                        'password' => $request->password,
                        'role' => $request->role,
                        'phone' => $request->phone
                    ]
                );
            
            $accountId = $account->id;

            $agency = Agency::
                create(
                    [
                        'account_id' => $accountId,
                        'agency_name' => $request->agency_name,
                        'npwp' => $request->npwp,
                        'location' => $request->location
                    ]
                );

            $message = "success";

            return [
                'status' => "ok",
                'message' => $message
            ];
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return [
                'status' => "error",
                'message' => $message
            ];
        }
    }

    public function Login(LoginRequest $request)
    {
        try
        {
            $account = Account::where('email', $request->email)->first();

            if($account == null)
            {
                return [
                    'status' => "error",
                    'message' => "Email not found",
                    'id' => "-"
                ];
            }
            else
            {
                if($account->password != $request->password)
                {
                    return [
                        'status' => "error",
                        'message' => "Password not match",
                        'id' => "-"
                    ];
                }
                else
                {
                    return [
                        'status' => "ok",
                        'message' => "success",
                        'id' => $account->account_id
                    ];
                }
            }
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return [
                'status' => "error",
                'message' => $message,
                'id' => "-"
            ];
        }
    }

    public function UpdateCustomerAccount(UpdateCustomerAccountRequest $request)
    {
        try {
            $account = Account::where('email', $request->email)->first();
    
            if ($account != null) {
                $updateData = [];
    
                if ($request->account_name != null || $request->account_name != '') {
                    $updateData['account_name'] = $request->account_name;
                }
    
                if ($request->password != null || $request->password != '') {
                    $updateData['password'] = $request->password;
                }
    
                if ($request->phone != null || $request->phone != '') {
                    $updateData['phone'] = $request->phone;
                }
    
                $account->update($updateData);
    
                return [
                    'status' => "ok",
                    'message' => "success"
                ];
            } 
            else 
            {
                return [
                    'status' => "error",
                    'message' => "Email not found"
                ];
            }
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return [
                'status' => "error",
                'message' => $message
            ];
        }
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
