<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBorrowingRequest extends FormRequest
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
            'equipment_id' => [
                'required',
                'exists:equipment,id',
                Rule::exists('equipment', 'id')->where(function ($query) {
                    $query->where('status', 'available')
                        ->where('is_available_for_borrowing', true);
                }),
            ],
            'due_date' => ['required', 'date', 'after:today'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'purpose' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'equipment_id.required' => 'Please select equipment to borrow.',
            'equipment_id.exists' => 'Selected equipment is not available for borrowing.',
            'due_date.required' => 'Due date is required.',
            'due_date.after' => 'Due date must be after today.',
            'purpose.required' => 'Purpose of borrowing is required.',
            'purpose.max' => 'Purpose cannot exceed 255 characters.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }

    /**
     * Get custom attribute names.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'equipment_id' => 'equipment',
            'due_date' => 'due date',
            'notes' => 'additional notes',
            'purpose' => 'purpose of borrowing',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'borrowed_at' => now(),
        ]);
    }
}
