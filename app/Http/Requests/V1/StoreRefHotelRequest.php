<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreRefHotelRequest extends FormRequest
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
            'hotel_code' => ['required'],
            'ref_zipcode_id' => ['required'],
            'hotel_name' => ['required'],
            'description' => ['required'],
            'address' => ['required'],
            'rating' => ['nullable'],
            'is_active' => ['required'],
            'qty' => ['required'],
            'promo_code' => ['nullable'],
            'base_price' => ['required'],
            'promo_code_affiliate' => ['nullable'],
            'picture' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:10000']
        ];
    }
}
