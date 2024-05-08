<?php

namespace App\Http\Services;

use App\Models\Constanta;
use App\Models\RefPicture;
use App\Models\AgencyPayment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Interfaces\AgencyPaymentInterface;
use App\Http\Requests\V1\StoreAgencyPaymentRequest;

class AgencyPaymentService implements AgencyPaymentInterface
{
    #region Private Function
    private function getAgencyPaymentById($id)
    {
        $agencyPayment = AgencyPayment::where('agency_payment_id', $id)->first();
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

    private function createAgencyPaymentBank($agency_id, $payment_type, $bank_name, $account_no)
    {
        $agencyPayment = AgencyPayment::create([
            'agency_id' => $agency_id,
            'payment_type' => $payment_type,
            'bank_name' => $bank_name,
            'account_no' => $account_no
        ]);

        return $agencyPayment;
    }

    private function createAgencyPaymentQris($agency_id, $payment_type, $bank_name)
    {
        $agencyPayment = AgencyPayment::create([
            'agency_id' => $agency_id,
            'payment_type' => $payment_type,
            'bank_name' => $bank_name,
            'account_no' => null
        ]);

        return $agencyPayment;
    }
    #endregion

    #region Public Function
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
            else
            {
                $agencyPayment = $this->createAgencyPaymentBank($request->agency_id, $request->payment_type, $request->bank_name, $request->account_no);
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
    #endregion
}