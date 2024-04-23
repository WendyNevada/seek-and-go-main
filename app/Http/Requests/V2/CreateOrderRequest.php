<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
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
            'agency_id' => ['required'],
            'customer_id' => ['required'],
            'details' => ['required', 'array'],
            'details.*.package_h_id' => ['nullable'],
            'details.*.ref_hotel_id' => ['nullable'],
            'details.*.ref_attraction_id' => ['nullable'],
            'details.*.ref_vehicle_id' => ['nullable'],
            'details.*.start_dt' => ['required','string'],
            'details.*.end_dt' => ['required', 'string'],
            'details.*.price' => ['required']
        ];
    }
}
