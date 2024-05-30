<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Account;
use App\Models\Constanta;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Services\AccountService;
use App\Http\Requests\V2\LoginRequest;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\V2\AccountIdRequest;
use App\Http\Requests\V2\CheckEmailRequest;
use App\Http\Requests\V1\StoreAccountRequest;
use App\Http\Resources\V1\CheckEmailResource;
use App\Http\Requests\V2\ChangePasswordRequest;
use App\Http\Requests\V2\ForgotPasswordRequest;
use App\Http\Requests\V2\StoreAccountAgencyRequest;
use App\Http\Requests\V2\UpdateAgencyAccountRequest;
use App\Http\Requests\V2\UpdateCustomerAccountRequest;

class AccountController extends Controller
{
    public function CreateAccountCustomer(AccountService $accountService, StoreAccountRequest $request)
    {
        $response = $accountService->CreateAccountCustomer($request);
        return $response;
    }

    public function CreateAccountAgency(AccountService $accountService, StoreAccountAgencyRequest $request)
    {
        $response = $accountService->CreateAccountAgency($request);
        return $response;
    }

    public function Login(AccountService $accountService, LoginRequest $request)
    {
        $response = $accountService->Login($request);
        return $response;
    }

    public function UpdateCustomerAccount(AccountService $accountService, UpdateCustomerAccountRequest $request)
    {
        $response = $accountService->UpdateCustomerAccount($request);
        return $response;
    }

    public function UpdateAgencyAccount(AccountService $accountService, UpdateAgencyAccountRequest $request)
    {
        $response = $accountService->UpdateAgencyAccount($request);
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

    public function verify($account_id, Request $request)
    {
        if (!$request->hasValidSignature()) {
            return response()->json(["msg" => "Invalid/Expired URL provided."], 401);
        }

        $account = Account::findOrFail($account_id);

        if (!$account->hasVerifiedEmail()) {
            $account->markEmailAsVerified();
        }

        return Redirect::to(Constanta::$enviLocal . 'login');
    }

    public function resend(Request $request)
    {
        $account = $request->user(); // Assuming you're using Laravel's built-in authentication

        if ($account->hasVerifiedEmail()) {
            return response()->json(["msg" => "Email already verified."], 400);
        }

        $account->sendEmailVerificationNotification();

        return response()->json(["msg" => "Email verification link sent to your email address."]);
    }

    public function ForgotPasswordRequest(AccountService $accountService, ForgotPasswordRequest $request)
    {
        $response = $accountService->ForgotPasswordRequest($request);
        return $response;
    }

    public function ResetPassword(AccountService $accountService, ForgotPasswordRequest $request)
    {
        $response = $accountService->ResetPassword($request);
        return $response;
    }

    public function GetAccountInfoById(AccountService $accountService, AccountIdRequest $request)
    {
        $response = $accountService->GetAccountInfoById($request);
        return $response;
    }

    public function ChangePassword(AccountService $accountService, ChangePasswordRequest $request)
    {
        $response = $accountService->ChangePassword($request);
        return $response;
    }

}
