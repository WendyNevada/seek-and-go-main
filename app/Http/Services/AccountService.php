<?php

namespace App\Http\Services;

use App\Models\Account;
use App\Http\Interfaces\AccountInterface;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;
use App\Http\Requests\V2\LoginRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Models\Agency;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;


class AccountService implements AccountInterface
{

    public function Login(LoginRequest $request)
    {
        try
        {
            $account = Account::where('email', $request->email)->first();

            if($account == null)
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found",
                    'account_id' => "-",
                    'role' => "-"
                ], 400);
            }
            else
            {
                if($account->password != $request->password)
                {
                    return response()->json([
                        'status' => "error",
                        'message' => "Password not match",
                        'account_id' => "-",
                        'role' => "-"
                    ], 400);
                }
                else
                {
                    return response()->json([
                        'status' => "ok",
                        'message' => "success",
                        'account_id' => $account->account_id,
                        'role' => $account->role
                    ], 200);
                }
            }
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-"
            ], 500);
        }
    }

    public function CreateAccountCustomer(StoreAccountRequest $request)
    {
        try
        {
            $accountCheck = Account::where('email', $request->email)->first();

            if($accountCheck == null)
            {
                DB::beginTransaction();

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
                
                $accountId = $account->account_id;

                $strBirthDate = $request->birth_date;
                
                if(strpos($strBirthDate, "T") == true)
                {
                    $string = $request->birth_date;
                    $parts = explode("T", $string);
                    $strBirthDate = $parts[0];
                }

                $customer = Customer::
                    create(
                        [
                            'account_id' => $accountId,
                            'customer_name' => $request->customer_name,
                            'gender' => $request->gender,
                            'birth_date' => $strBirthDate
                        ]
                    );

                DB::commit();

                $message = "success";

                return response()->json([
                    'status' => 'ok',
                    'message' => $message
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "email already exist"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message
            ], 500);
        }
    }

    public function CreateAccountAgency(StoreAccountAgencyRequest $request)
    {
        try
        {
            $accountCheck = Account::where('email', $request->email)->first();

            if($accountCheck == null)
            {
                DB::beginTransaction();

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
                
                $accountId = $account->account_id;

                $agency = Agency::
                    create(
                        [
                            'account_id' => $accountId,
                            'agency_name' => $request->agency_name,
                            'npwp' => $request->npwp,
                            'location' => $request->location
                        ]
                    );

                DB::commit();

                $message = "success";

                return response()->json([
                    'status' => "ok",
                    'message' => $message
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "email already exist"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message
            ], 500);
        }
    }

    public function UpdateCustomerAccount(UpdateCustomerAccountRequest $request)
    {
        try 
        {
            $account = Account::where('email', $request->email)->first();
    
            if ($account != null) 
            {
                DB::beginTransaction();

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
    
                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success"
                ], 200);
            } 
            else 
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message
            ], 500);
        }
    }

    public function UpdateAgencyAccount(UpdateAgencyAccountRequest $request)
    {
        try 
        {
            $account = Account::where('email', $request->email)->first();
    
            if ($account != null) 
            {
                DB::beginTransaction();

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

                $agency = Agency::where('account_id', $account->account_id)->first();

                $agency = $agency->update([
                    'agency_name' => $request->agency_name,
                    'npwp' => $request->npwp,
                    'location' => $request->location
                ]);
    
                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success"
                ], 200);
            } 
            else 
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message
            ], 500);
        }
    }

}