<?php

namespace App\Http\Controllers;

use App\Enums\BorrowingStatusEnum;
use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\Equipment;
use App\Models\EquipmentUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Middleware\PermissionMiddleware;

class EquipmentUserController extends Controller implements HasMiddleware
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
     * Display a listing of borrowing requests.
     */
    public function index(Request $request)
    {
        $query = EquipmentUser::with(['equipment', 'user', 'approver', 'equipmentUserDetails.equipment'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        // Filter by user (if not admin)
        if (! Auth::user()->can('view all borrowings')) {
            $query->where('user_id', Auth::id());
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->whereHas('equipment', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            })->orWhereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $borrowings = $query->paginate(10)->withQueryString();

        // Get equipment available for borrowing
        $availableEquipment = Equipment::where('status', 'available')
            ->where('is_available_for_borrowing', true)
            ->with('division')
            ->orderBy('name')
            ->get();

        return Inertia::render('equipment-users/index', [
            'borrowings' => $borrowings,
            'availableEquipment' => $availableEquipment,
            'filters' => $request->only(['search', 'status']),
            'canManageBorrowings' => Auth::user()->can('manage borrowings'),
        ]);
    }

    /**
     * Show the form for creating a new borrowing request.
     */
    public function create()
    {
        $availableEquipment = Equipment::where('status', 'available')
            ->where('is_available_for_borrowing', true)
            ->with('division')
            ->orderBy('name')
            ->get();

        return Inertia::render('equipment-users/create', [
            'availableEquipment' => $availableEquipment,
        ]);
    }

    /**
     * Store a newly created borrowing request with support for multiple equipment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'equipment_ids' => 'required|array|min:1',
            'equipment_ids.*' => 'required|exists:equipment,id',
            'purpose' => 'required|string|max:500',
            'due_date' => 'required|date|after:today',
            'notes' => 'nullable|string|max:1000',
        ]);

        $equipmentIds = $request->input('equipment_ids');

        // Check if all equipment is still available
        $unavailableEquipment = Equipment::whereIn('id', $equipmentIds)
            ->where(function ($query) {
                $query->where('status', '!=', 'available')
                    ->orWhere('is_available_for_borrowing', false);
            })
            ->get();

        if ($unavailableEquipment->isNotEmpty()) {
            return redirect()->back()
                ->with('error', 'Some equipment is no longer available for borrowing: '.
                    $unavailableEquipment->pluck('name')->join(', '));
        }

        // Create the main borrowing record
        $equipmentUser = EquipmentUser::create([
            'equipment_id' => $equipmentIds[0], // Keep the first equipment for backward compatibility
            'user_id' => Auth::id(),
            'purpose' => $request->input('purpose'),
            'due_date' => $request->input('due_date'),
            'notes' => $request->input('notes'),
            'status' => BorrowingStatusEnum::PENDING->value,
        ]);

        // Create detail records for all equipment
        foreach ($equipmentIds as $equipmentId) {
            $equipmentUser->equipmentUserDetails()->create([
                'equipment_id' => $equipmentId,
            ]);
        }

        return redirect()->route('equipment-users.index')
            ->with('success', 'Borrowing request submitted successfully for '.count($equipmentIds).' equipment(s).');
    }

    /**
     * Display the specified borrowing.
     */
    public function show(EquipmentUser $borrowing)
    {
        $borrowing->load(['equipment.division', 'user', 'approver', 'equipmentUserDetails.equipment.division']);

        // Check if user can view this borrowing
        if (! Auth::user()->can('view all borrowings') && $borrowing->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('equipment-users/show', [
            'borrowing' => $borrowing,
            'canManage' => Auth::user()->can('manage borrowings'),
        ]);
    }

    /**
     * Approve a borrowing request.
     */
    public function approve(EquipmentUser $borrowing)
    {
        if (! Auth::user()->hasAnyRole(RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value)) {
            abort(403);
        }

        if ($borrowing->status !== BorrowingStatusEnum::PENDING->value) {
            return redirect()->back()
                ->with('error', 'Only pending requests can be approved.');
        }

        // Load equipment details relationship
        $borrowing->load('equipmentUserDetails.equipment');

        // Check if equipment is still available
        if (! $borrowing->equipment->is_available_for_borrowing) {
            return redirect()->back()
                ->with('error', 'Equipment is no longer available for borrowing.');
        }

        $borrowing->update([
            'status' => BorrowingStatusEnum::APPROVED->value,
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        // Update equipment status for all equipment in this borrowing
        if ($borrowing->equipmentUserDetails->isNotEmpty()) {
            // Update all equipment from details
            foreach ($borrowing->equipmentUserDetails as $detail) {
                if ($detail->equipment) {
                    $detail->equipment->update(['status' => 'borrowed']);
                }
            }
        } else {
            // Fallback to main equipment for backward compatibility
            $borrowing->equipment->update(['status' => 'borrowed']);
        }

        return redirect()->back()
            ->with('success', 'Borrowing request approved successfully.');
    }

    /**
     * Reject a borrowing request.
     */
    public function reject(EquipmentUser $borrowing)
    {
        if (! Auth::user()->hasAnyRole(RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value)) {
            abort(403);
        }

        if ($borrowing->status !== BorrowingStatusEnum::PENDING->value) {
            return redirect()->back()
                ->with('error', 'Only pending requests can be rejected.');
        }

        $borrowing->update([
            'status' => BorrowingStatusEnum::CANCELLED->value,
            'approved_by' => Auth::id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Borrowing request rejected.');
    }

    /**
     * Return borrowed equipment.
     */
    public function return(EquipmentUser $borrowing)
    {
        if (! Auth::user()->hasAnyRole(RoleEnum::ADMIN->value, RoleEnum::SUPER_ADMIN->value)) {
            abort(403);
        }

        if ($borrowing->status !== BorrowingStatusEnum::APPROVED->value) {
            return redirect()->back()
                ->with('error', 'Only approved borrowings can be returned.');
        }

        // Load equipment details relationship
        $borrowing->load('equipmentUserDetails.equipment');

        $borrowing->update([
            'status' => BorrowingStatusEnum::RETURNED->value,
            'returned_at' => now(),
        ]);

        // Update equipment status back to available for all equipment
        if ($borrowing->equipmentUserDetails->isNotEmpty()) {
            // Update all equipment from details
            foreach ($borrowing->equipmentUserDetails as $detail) {
                if ($detail->equipment) {
                    $detail->equipment->update(['status' => 'available']);
                }
            }
        } else {
            // Fallback to main equipment for backward compatibility
            $borrowing->equipment->update(['status' => 'available']);
        }

        return redirect()->back()
            ->with('success', 'Equipment returned successfully.');
    }
}
