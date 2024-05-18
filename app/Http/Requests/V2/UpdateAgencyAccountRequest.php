<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgencyAccountRequest extends FormRequest
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
            'account_id' => ['required'],
            'account_name' => ['string', 'nullable'],
            'password' => ['string', 'nullable'],
            'phone' => ['string', 'nullable'],
            'agency_name' => ['string', 'nullable'],
            'npwp' => ['string', 'nullable'],
            'location' => ['string', 'nullable']
        ];
    }
}
