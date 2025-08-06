<?php

namespace App\Http\Requests;

use App\Enums\EquipmentStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateEquipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->division_id === '' || $this->division_id === 'none') {
            $this->merge(['division_id' => null]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $equipmentId = $this->route('equipment')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255', "unique:equipment,serial_number,{$equipmentId}"],
            'type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'warranty_expires_at' => ['nullable', 'date', 'after:purchase_date'],
            'status' => ['required', new Enum(EquipmentStatusEnum::class)],
            'division_id' => ['nullable', 'exists:divisions,id'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'notes' => ['nullable', 'string'],
            'is_available_for_borrowing' => ['boolean'],
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
            'name.required' => 'Equipment name is required.',
            'brand.required' => 'Brand is required.',
            'model.required' => 'Model is required.',
            'type.required' => 'Equipment type is required.',
            'division_id.required' => 'Division is required.',
            'division_id.exists' => 'Selected division does not exist.',
            'serial_number.unique' => 'This serial number is already in use.',
            'purchase_price.numeric' => 'Purchase price must be a valid number.',
            'warranty_expires_at.after' => 'Warranty expiration must be after purchase date.',
            'image.image' => 'File must be an image.',
            'image.mimes' => 'Image must be a file of type: jpeg, png, jpg, gif.',
            'image.max' => 'Image size cannot exceed 2MB.',
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
            'division_id' => 'division',
            'is_available_for_borrowing' => 'available for borrowing',
            'warranty_expires_at' => 'warranty expiration date',
            'purchase_date' => 'purchase date',
            'purchase_price' => 'purchase price',
            'serial_number' => 'serial number',
        ];
    }
}
