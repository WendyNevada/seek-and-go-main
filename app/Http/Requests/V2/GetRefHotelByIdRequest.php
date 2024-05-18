<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;

class GetRefHotelByIdRequest extends FormRequest
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
            'ref_hotel_id' => ['required']
        ];
    }
}
