<?php

namespace App\Http\Controllers;

use App\Enums\EquipmentStatusEnum;
use App\Enums\PermissionEnum;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Models\Division;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Middleware\PermissionMiddleware;

class EquipmentController extends Controller implements HasMiddleware
{

    public static function middleware(): array
    {
        return [
            new Middleware(PermissionMiddleware::using(PermissionEnum::EQUIPMENT_READ->value)),
            new Middleware(PermissionMiddleware::using(PermissionEnum::EQUIPMENT_CREATE->value), only: ['create', 'store']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::EQUIPMENT_UPDATE->value), only: ['edit', 'update']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::EQUIPMENT_DELETE->value), only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Equipment::with(['currentBorrower', 'division'])
            ->orderBy('name');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->get('type'));
        }

        // Division filter
        if ($request->filled('division_id')) {
            $query->where('division_id', $request->get('division_id'));
        }

        $equipment = $query->paginate(10)->withQueryString();

        // Get available divisions and unique types for filters
        $divisions = Division::where('is_active', true)->orderBy('name')->get();
        $types = Equipment::distinct()->pluck('type')->filter()->sort()->values();

        return Inertia::render('equipment/index', [
            'equipment' => $equipment,
            'divisions' => $divisions,
            'types' => $types,
            'filters' => $request->only(['search', 'status', 'type', 'division_id']),
            'statuses' => collect(EquipmentStatusEnum::cases())->map(function ($status) {
                return [
                    'value' => $status->value,
                    'name' => $status->label(),
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $divisions = Division::where('is_active', true)->orderBy('name')->get();

        // Format statuses for Select component
        $statuses = collect(EquipmentStatusEnum::cases())->map(function ($status) {
            return [
                'value' => $status->value,
                'name' => $status->label(),
            ];
        });

        return Inertia::render('equipment/create', [
            'divisions' => $divisions,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentRequest $request)
    {
        $validated = $request->validated();

        // Generate unique equipment code
        $validated['code'] = $this->generateEquipmentCode($validated['type']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
            $path = $image->storeAs('equipment', $filename, 'public');
            $validated['image_path'] = $path;
        }

        Equipment::create($validated);

        return redirect()->route('equipment.index')
            ->with('success', 'Equipment created successfully.');
    }

    /**
     * Generate a unique equipment code based on type
     */
    private function generateEquipmentCode(string $type): string
    {
        // Get type prefix (first 3 letters, uppercase)
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $type), 0, 3));
        if (strlen($prefix) < 3) {
            $prefix = str_pad($prefix, 3, 'X');
        }

        // Get current year
        $year = date('Y');

        // Find next sequence number
        $lastEquipment = Equipment::where('code', 'like', "{$prefix}-{$year}-%")
            ->orderBy('code', 'desc')
            ->first();

        if ($lastEquipment) {
            // Extract sequence number from last code
            $parts = explode('-', $lastEquipment->code);
            $lastSequence = isset($parts[2]) ? (int) $parts[2] : 0;
            $nextSequence = $lastSequence + 1;
        } else {
            $nextSequence = 1;
        }

        // Format: CAM-2025-001
        return sprintf('%s-%s-%03d', $prefix, $year, $nextSequence);
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        $equipment->load(['currentBorrower', 'division', 'borrowingHistory.user']);

        return Inertia::render('equipment/show', [
            'equipment' => $equipment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment)
    {
        $divisions = Division::where('is_active', true)->orderBy('name')->get();

        // Format statuses for Select component
        $statuses = collect(EquipmentStatusEnum::cases())->map(function ($status) {
            return [
                'value' => $status->value,
                'name' => $status->label(),
            ];
        });

        return Inertia::render('equipment/edit', [
            'equipment' => $equipment,
            'divisions' => $divisions,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($equipment->image_path) {
                Storage::disk('public')->delete($equipment->image_path);
            }

            $image = $request->file('image');
            $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
            $path = $image->storeAs('equipment', $filename, 'public');
            $validated['image_path'] = $path;
        }

        $equipment->update($validated);

        return redirect()->route('equipment.index')
            ->with('success', 'Equipment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment)
    {
        // Check if equipment is currently borrowed
        if ($equipment->isCurrentlyBorrowed()) {
            return redirect()->back()
                ->with('error', 'Cannot delete equipment that is currently borrowed.');
        }

        // Delete image if exists
        if ($equipment->image_path) {
            Storage::disk('public')->delete($equipment->image_path);
        }

        $equipment->delete();

        return redirect()->route('equipment.index')
            ->with('success', 'Equipment deleted successfully.');
    }
}
