<?php

namespace App\Http\Services;

use App\Models\Agency;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Constanta;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\V2\LoginRequest;
use App\Http\Interfaces\AccountInterface;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;
use App\Models\RefAttraction;

class AccountService implements AccountInterface
{

    #region Private Method
    private function getAccountByEmail($email): Account
    {
        $account = Account::where('email', $email)->first();
        return $account;
    }

    private function checkPassword($accPass, $reqPass): bool
    {
        if($accPass == $reqPass)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkRole($accRole, $reqRole): bool
    {
        if($accRole == $reqRole)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function createAccount($account_name, $email, $password, $role, $phone): Account
    {
        $createAccount = Account::
                    create(
                        [
                            'account_name' => $account_name,
                            'email' => $email,
                            'password' => $password,
                            'role' => $role,
                            'phone' => $phone
                        ]
                    );

        return $createAccount;
    }

    private function reformatDate($date): string
    {
        $strDate = $date->birth_date;
                
        if(strpos($strDate, "T") == true)
        {
            $string = $date->birth_date;
            $parts = explode("T", $string);
            $strDate = $parts[0];
        }

        return $strDate;
    }

    private function createCustomer($accountId, $customer_name, $gender, $birthDate): Customer
    {
        $customer = Customer::
                    create(
                        [
                            'account_id' => $accountId,
                            'customer_name' => $customer_name,
                            'gender' => $gender,
                            'birth_date' => $birthDate
                        ]
                    );
        
        return $customer;
    }

    private function createAgency($accountId, $agency_name, $npwp, $location): Agency
    {
        $agency = Agency::
                    create(
                        [
                            'account_id' => $accountId,
                            'agency_name' => $agency_name,
                            'npwp' => $npwp,
                            'location' => $location
                        ]
                    );
        
        return $agency;
    }

    private function updateAccount($account_id, $account_name, $password, $phone): Account
    {
        $account = Account::find($account_id);
        $account->account_name = $account_name;
        $account->password = $password;
        $account->phone = $phone;
        $account->save();
        return $account;
    }

    private function updateAgency($account_id, $agency_name, $npwp, $location): Agency
    {
        $agency = Agency::find($account_id);
        $agency->agency_name = $agency_name;
        $agency->npwp = $npwp;
        $agency->location = $location;
        $agency->save();
        return $agency;
    }
    #endregion

    #region Public Method

    public function Login(LoginRequest $request)
    {
        try
        {
            $account = $this->getAccountByEmail($request->email);

            if($account == null)
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found",
                    'account_id' => "-",
                    'role' => "-",
                    'customer_id' => "-",
                    'agency_id' => "-"
                ], 400);
            }
            else
            {
                if(!$this->checkPassword($account->password, $request->password))
                {
                    return response()->json([
                        'status' => "error",
                        'message' => "Password does not match",
                        'account_id' => "-",
                        'role' => "-",
                        'customer_id' => "-",
                        'agency_id' => "-"
                    ], 400);
                }
                else
                {
                    if($this->checkRole($account->role, Constanta::$roleCustomer))
                    {
                        return response()->json([
                            'status' => "ok",
                            'message' => "success",
                            'account_id' => $account->account_id,
                            'role' => $account->role,
                            'customer_id' => $account->customers->customer_id,
                            'agency_id' => "-"
                        ], 200);
                    }
                    else
                    {
                        return response()->json([
                            'status' => "ok",
                            'message' => "success",
                            'account_id' => $account->account_id,
                            'role' => $account->role,
                            'customer_id' => "-",
                            'agency_id' => $account->agencies->agency_id
                        ], 200);
                    }
                }
            }
        }
        catch(\Exception $e)
        {
            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-",
                'customer_id' => "-",
                'agency_id' => "-"
            ], 500);
        }
    }

    public function CreateAccountCustomer(StoreAccountRequest $request)
    {
        try
        {
            $accountCheck = $this->getAccountByEmail($request->email);

            if($accountCheck == null)
            {
                DB::beginTransaction();

                $account = $this->createAccount($request->account_name, $request->email, $request->password, $request->role, $request->phone);
                
                $accountId = $account->account_id;

                $strBirthDate = $this->reformatDate($request->birth_date);

                $customer = $this->createCustomer($accountId, $request->customer_name, $request->gender, $strBirthDate);

                DB::commit();

                $message = "success";

                return response()->json([
                    'status' => 'ok',
                    'message' => $message,
                    'account_id' => $accountId
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "email already exist",
                    'account_id' => "-",
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-",
            ], 500);
        }
    }

    public function CreateAccountAgency(StoreAccountAgencyRequest $request)
    {
        try
        {
            $accountCheck = $this->getAccountByEmail($request->email);

            if($accountCheck == null)
            {
                DB::beginTransaction();

                $account = $this->createAccount($request->account_name, $request->email, $request->password, $request->role, $request->phone);
                
                $accountId = $account->account_id;

                $agency = $this->createAgency($accountId, $request->agency_name, $request->npwp, $request->location);

                DB::commit();

                $message = "success";

                return response()->json([
                    'status' => "ok",
                    'message' => $message,
                    'account_id' => $account->account_id
                ], 200);
            }
            else
            {
                return response()->json([
                    'status' => "error",
                    'message' => "email already exist",
                    'account_id' => "-",
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-",
            ], 500);
        }
    }

    public function UpdateCustomerAccount(UpdateCustomerAccountRequest $request)
    {
        try 
        {
            $account = $this->getAccountByEmail($request->email);
    
            if ($account != null) 
            {
                DB::beginTransaction();
                
                $this->updateAccount($account->account_id, $request->account_name, $request->email, $request->password, $request->role, $request->phone);
    
                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'account_id' => $account->account_id
                ], 200);
            } 
            else 
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found",
                    'account_id' => "-"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-"
            ], 500);
        }
    }

    public function UpdateAgencyAccount(UpdateAgencyAccountRequest $request)
    {
        try 
        {
            $account = $this->getAccountByEmail($request->email);
    
            if ($account != null) 
            {
                DB::beginTransaction();

                $account = $this->updateAccount($account->account_id, $request->account_name, $request->email, $request->password, $request->role, $request->phone);

                $agency = $this->updateAgency($account->account_id, $request->agency_name, $request->npwp, $request->location);
    
                DB::commit();

                return response()->json([
                    'status' => "ok",
                    'message' => "success",
                    'account_id' => $account->account_id
                ], 200);
            } 
            else 
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Email not found",
                    'account_id' => "-"
                ], 400);
            }
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            $message = $e->getMessage();

            return response()->json([
                'status' => "error",
                'message' => $message,
                'account_id' => "-"
            ], 500);
        }
    }

    #endregion

}