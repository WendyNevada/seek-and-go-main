<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StorePromoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'promo_code' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'is_hotel' => 'required',
            'is_vehicle' => 'required',
            'is_attraction' => 'required',
            'is_amount' => 'required',
            'is_package' => 'required',
            'amount' => 'required',
            'percent' => 'required'
        ];
    }
}
