<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRefVehicleRequest extends FormRequest
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
            'ref_vehicle_id' => 'required',
            'vehicle_type' => 'required',
            'vehicle_brand' => 'required',
            'vehicle_series' => 'required',
            'vehicle_model' => 'required',
            'vehicle_year' => 'required',
            'vehicle_name' => 'required',
            'description' => 'required',
            'with_driver' => 'required',
            'address' => 'required',
            'qty' => 'required',
            'promo_code' => 'nullable',
            'base_price' => ['required'],
            'picture' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:10000'],
            'picture_url' => ['nullable', 'string']
        ];
    }
}
