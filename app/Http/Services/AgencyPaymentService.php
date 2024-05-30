<?php

namespace App\Http\Services;

use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\AgencyPayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Interfaces\AgencyPaymentInterface;
use App\Http\Requests\V1\StoreAgencyPaymentRequest;
use App\Http\Requests\V1\UpdateAgencyPaymentRequest;
use App\Http\Requests\V2\AgencyIdRequest;
use App\Http\Requests\V2\AgencyPaymentIdRequest;

class AgencyPaymentService implements AgencyPaymentInterface
{
    #region Private Function
    private function getAgencyPaymentById($id)
    {
        $agencyPayment = AgencyPayment::where('agency_payment_id', $id)->first();
        return $agencyPayment;
    }

    private function getDataAgencyPaymentByAgencyId($agency_id)
    {
        $agencyPayment = AgencyPayment::where('agency_id', $agency_id)->get();

        foreach ($agencyPayment as $key => $value)
        {
            $picture = RefPicture::where('agency_payment_id', $value->agency_payment_id)->first();

            if($picture != null)
            {
                $image_url = $picture->image_url;
            }
            else
            {
                $image_url = "-";
            }

            $value->image_url = $image_url;
        }

        return $agencyPayment;
    }

    private function insertRefPictureAgencyPayment($picture, $agency_name, $agency_payment_id): void
    {
        $image = $picture;
        $imageName =  $agency_name . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$agencyPaymentPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = new RefPicture();

        $refPicture->agency_payment_id = $agency_payment_id;
        $refPicture->image_url = $url;
        $refPicture->save();
    }

    private function createAgencyPaymentBank($agency_id, $payment_type, $bank_name, $account_no, $account_name)
    {
        $agencyPayment = AgencyPayment::create([
            'agency_id' => $agency_id,
            'payment_type' => $payment_type,
            'bank_name' => $bank_name,
            'account_no' => $account_no,
            'account_name' => $account_name
        ]);

        return $agencyPayment;
    }

    private function createAgencyPaymentQris($agency_id, $payment_type, $bank_name, $account_name)
    {
        $agencyPayment = AgencyPayment::create([
            'agency_id' => $agency_id,
            'payment_type' => $payment_type,
            'bank_name' => $bank_name,
            'account_no' => null,
            'account_name' => $account_name
        ]);

        return $agencyPayment;
    }

    private function editRefPictureAgencyPayment($picture, $agency_name, $agency_payment_id)
    {
        $image = $picture;
        $imageName =  $agency_name . '_' . time() . '.' . $image->getClientOriginalName();
        $path = $image->storeAs(Constanta::$agencyPaymentPictureDirectory, $imageName, Constanta::$refPictureDisk);
        $url = Storage::url($path);

        $refPicture = RefPicture::where('agency_payment_id', $agency_payment_id)->first();
        $refPicture->image_url = $url;
        $refPicture->save();
    }

    private function editAgencyPaymentAccountNo($agency_payment_id, $account_no, $account_name)
    {
        $agencyPayment = AgencyPayment::where('agency_payment_id', $agency_payment_id)->first();
        $agencyPayment->account_no = $account_no;
        $agencyPayment->account_name = $account_name;
        $agencyPayment->save();
    }

    private function deleteAgencyPayment($agency_payment_id)
    {
        $agencyPayment = AgencyPayment::where('agency_payment_id', $agency_payment_id)->first();
        $agencyPayment->delete();
    }

    private function deleteRefPictureAgencyPayment($agency_payment_id)
    {
        $refPicture = RefPicture::where('agency_payment_id', $agency_payment_id)->first();
        $refPicture->delete();
    }

    private function checkDataEmpty($data)
    {
        if(count($data) <= 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region Public Function
    public function GetAllAgencyPaymentByAgencyId(AgencyIdRequest $request)
    {
        $agencyPayment = $this->getDataAgencyPaymentByAgencyId($request->agency_id);

        if($this->checkDataEmpty($agencyPayment))
        {
            return response()->json([
                'status' => 'error',
                'message' => 'data not found',
                'data' => null
            ], 400);
        }
        else
        {
            return response()->json([
                'status' => 'ok',
                'message' => 'success',
                'data' => $agencyPayment
            ], 200);
        }
    }

    public function InsertAgencyPayment(StoreAgencyPaymentRequest $request)
    {
        try
        {
            DB::beginTransaction();

            if($request->payment_type == Constanta::$paymentTypeQris && $request->picture != null)
            {
                $agencyPayment = $this->createAgencyPaymentQris($request->agency_id, $request->payment_type, $request->bank_name, $request->picture);

                $this->insertRefPictureAgencyPayment($request->picture, $agencyPayment->agencies->agency_name, $agencyPayment->agency_payment_id);
            }
            else if($request->payment_type == Constanta::$paymentTypeBank)
            {
                $agencyPayment = $this->createAgencyPaymentBank($request->agency_id, $request->payment_type, $request->bank_name, $request->account_no, $request->account_name);
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Agency Payment has been created'
        ], 200);

        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return $e->getMessage();
        }
    }

    public function EditAgencyPayment(UpdateAgencyPaymentRequest $request)
    {
        try
        {
            $agencyPayment = $this->getAgencyPaymentById($request->agency_payment_id);

            DB::beginTransaction();

            if($agencyPayment->payment_type == Constanta::$paymentTypeQris)
            {
                $this->editRefPictureAgencyPayment($request->picture, $agencyPayment->agencies->agency_name, $agencyPayment->agency_payment_id);
            }
            else
            {
                $this->editAgencyPaymentAccountNo($request->agency_payment_id, $request->account_no, $request->account_name);
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Agency Payment has been updated'
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function RemoveAgencyPayment(AgencyPaymentIdRequest $request)
    {
        try
        {
            $agencyPayment = $this->getAgencyPaymentById($request->agency_payment_id);

            DB::beginTransaction();

            if($agencyPayment->payment_type == Constanta::$paymentTypeQris)
            {
                $this->deleteRefPictureAgencyPayment($request->agency_payment_id);

                $this->deleteAgencyPayment($request->agency_payment_id);
            }
            else
            {
                $this->deleteAgencyPayment($request->agency_payment_id);
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Agency Payment has been deleted'
            ]);
        }
        catch(\Exception $e)
        {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
    #endregion
}