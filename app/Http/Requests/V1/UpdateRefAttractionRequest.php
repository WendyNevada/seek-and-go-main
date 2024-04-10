<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRefAttractionRequest extends FormRequest
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
            'ref_attraction_id' => ['required'],
            'ref_zipcode_id' => ['required'],
            'attraction_name' => ['required'],
            'description' => ['required'],
            'address' => ['required'],
            'is_active' => ['required'],
            'qty' => ['required'],
            'promo_code' => ['nullable'],
            'picture' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:2048']
        ];
    }
}
