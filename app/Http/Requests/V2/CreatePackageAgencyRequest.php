<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;

class CreatePackageAgencyRequest extends FormRequest
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
            'package_code' => ['required'],
            'agency_id' => ['required'],
            'package_name' => ['required'],
            'description' => ['required'],
            'package_price' => ['required'],
            'qty' => ['required'],
            'total_days' => ['required'],
            'details' => ['required', 'array'],
            'details.*.ref_hotel_id' => ['nullable'],
            'details.*.ref_attraction_id' => ['nullable'],
            'details.*.ref_vehicle_id' => ['nullable'],
            'details.*.start_dt' => ['nullable','string'],
            'details.*.end_dt' => ['nullable', 'string']
        ];
    }
}
