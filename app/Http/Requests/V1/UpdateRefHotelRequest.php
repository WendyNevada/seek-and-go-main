<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRefHotelRequest extends FormRequest
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
            'ref_hotel_id' => ['required'],
            'hotel_name' => ['required'],
            'description' => ['required'],
            'address' => ['required'],
            'qty' => ['required'],
            'promo_code' => ['nullable'],
            'base_price' => ['required'],
            'picture' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:10000'],
            'picture_url' => ['nullable', 'string']
        ];
    }
}
