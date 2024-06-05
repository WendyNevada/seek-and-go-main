<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;

class GetCustomPackageAgencyRequest extends FormRequest
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
            'agency_id' => 'required',
            'custom_status' => 'nullable'
        ];
    }
}