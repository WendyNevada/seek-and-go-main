<?php

namespace App\Http\Requests\V2;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccountAgencyRequest extends FormRequest
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
            'account_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['Customer', 'Agency'])],
            'phone' => ['required', 'string', 'max:15'],
            'agency_name' => ['required', 'string', 'max:255'],
            'npwp' => ['required', 'string', 'max:16'],
            'location' => ['required', 'string']
        ];
    }
}
