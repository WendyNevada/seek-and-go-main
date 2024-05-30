<?php

namespace App\Http\Services;

use App\Models\Agency;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Constanta;
use App\Mail\ForgotPasswordEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\V2\LoginRequest;
use Illuminate\Auth\Events\Registered;
use App\Http\Interfaces\AccountInterface;
use App\Http\Requests\V2\AccountIdRequest;
use App\Http\Requests\V1\StoreAccountRequest;
use Illuminate\Auth\Notifications\VerifyEmail;
use App\Http\Requests\V2\ChangePasswordRequest;
use App\Http\Requests\V2\ForgotPasswordRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;

class AccountService implements AccountInterface
{

    #region Private Method
    private function getAccountById($account_id)
    {
        $account = Account::where('account_id', $account_id)->first();
        return $account;
    }

    private function getAccountByEmail($email)
    {
        $account = Account::where('email', $email)->first();

        return $account;
    }

    private function getAccountDataById($account_id)
    {
        $account = Account::where('account_id', $account_id)->first();

        if($account->role == Constanta::$roleCustomer)
        {
            $account->customers;
        }
        else
        {
            $account->agencies;
        }

        return $account;
    }

    private function checkPassword($reqPass, $accPass): bool
    {
        if(Hash::check($accPass, $reqPass))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function checkRoleAndReturnData($account)
    {
        if($account->role == Constanta::$roleCustomer)
        {
            return [
                'customer_id' => $account->customers->customer_id,
                'agency_id' => "-"
            ];
        }
        else
        {
            return [
                'customer_id' => "-",
                'agency_id' => $account->agencies->agency_id
            ];
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

    private function reformatDate($date)
    {
        $strDate = $date;
                
        if(strpos($strDate, "T") == true)
        {
            $string = $date;
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

    private function updateAccount($account_id, $account_name, $phone): Account
    {
        $account = Account::find($account_id);
        $account->account_name = $account_name;
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

    private function checkEmailVerified($emailVerifiedAt)
    {
        if($emailVerifiedAt != null)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    private function sendForgotPasswordEmail($mailTo, $accountId, $url, $path)
    {
        Mail::to($mailTo)->send(new ForgotPasswordEmail($accountId, $url, $path));
    }

    private function checkConfirmedPassword($pass, $confPass): bool
    {
        if($pass == $confPass)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private function saveResetPassword($accountId, $password)
    {
        $account = Account::find($accountId);
        $account->password = $password;
        $account->save();
    }

    private function checkDataNull($data)
    {
        if($data == null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region Public Method

    public function GetAccountInfoById(AccountIdRequest $request)
    {
        $account = $this->getAccountDataById($request->account_id);
        
        if($this->checkDataNull($account) == true)
        {
            return response()->json([
                'status' => "error",
                'message' => "Account not found",
                'account' => "-"
            ], 400);
        }
        else
        {
            return response()->json([
                'status' => "ok",
                'message' => "success",
                'account' => $account
            ], 200);
        }
    }

    public function Login(LoginRequest $request)
    {
        try
        {
            $account = $this->getAccountByEmail($request->email);

            if($account == null)
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Account not found",
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
                    if($this->checkEmailVerified($account->email_verified_at))
                    {
                        return response()->json([
                            'status' => "error",
                            'message' => "Email is not verified",
                            'account_id' => "-",
                            'role' => "-",
                            'customer_id' => "-",
                            'agency_id' => "-"
                        ], 400);
                    }
                    else
                    {
                        $data = $this->checkRoleAndReturnData($account);
                        
                        return response()->json([
                            'status' => "ok",
                            'message' => "Success",
                            'account_id' => $account->account_id,
                            'role' => $account->role,
                            'customer_id' => $data['customer_id'],
                            'agency_id' => $data['agency_id']
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

                $account->sendEmailVerificationNotification();

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

                $account->sendEmailVerificationNotification();

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
            DB::beginTransaction();
            
            $account = $this->updateAccount($request->account_id, $request->account_name, $request->email, $request->role, $request->phone);

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "success",
                'account_id' => $account->account_id
            ], 200);
            
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
            DB::beginTransaction();

            $account = $this->updateAccount($request->account_id, $request->account_name, $request->email, $request->role, $request->phone);

            $agency = $this->updateAgency($account->account_id, $request->agency_name, $request->npwp, $request->location);

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "success",
                'account_id' => $account->account_id
            ], 200);
            
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

    public function ForgotPasswordRequest(ForgotPasswordRequest $request)
    {
        $account = $this->getAccountByEmail($request->email);

        if($account == null)
        {
            return response()->json([
                'status' => "error",
                'message' => "Account not found"
            ], 400);
        }
        else
        {
            $this->sendForgotPasswordEmail($account->email, $account->account_id, Constanta::$enviLocal, Constanta::$forgetPassword);

            return response()->json([
                'status' => "ok",
                'message' => "Forgot password verification has been sent to your email"
            ], 200);
        }
    }

    public function ResetPassword(ForgotPasswordRequest $request)
    {
        try
        {
            if(!$this->checkConfirmedPassword($request->password, $request->confirm_password))
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Password does not match"
                ], 400);
            }

            DB::beginTransaction();

            $this->saveResetPassword($request->account_id, $request->password);

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "Password successfully changed"
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ]);
        }
    }

    public function ChangePassword(ChangePasswordRequest $request)
    {
        try
        {
            $account = $this->getAccountById($request->account_id);

            if(!$this->checkPassword($account->password, $request->old_password))
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Old password does not match"
                ], 400);
            }

            if(!$this->checkConfirmedPassword($request->password, $request->confirm_password))
            {
                return response()->json([
                    'status' => "error",
                    'message' => "Password does not match"
                ], 400);
            }

            DB::beginTransaction();

            $this->saveResetPassword($request->account_id, $request->password);

            DB::commit();

            return response()->json([
                'status' => "ok",
                'message' => "Password successfully changed"
            ], 200);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => "error",
                'message' => $e->getMessage()
            ]);
        }
    }
    
    #endregion

}