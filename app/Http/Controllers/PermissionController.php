<?php

namespace App\Http\Controllers;

use App\Enums\PermissionEnum;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(PermissionMiddleware::using(PermissionEnum::PERMISSION_READ->value)),
            new Middleware(PermissionMiddleware::using(PermissionEnum::PERMISSION_CREATE->value), only: ['create', 'store']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::PERMISSION_UPDATE->value), only: ['edit', 'update']),
            new Middleware(PermissionMiddleware::using(PermissionEnum::PERMISSION_DELETE->value), only: ['destroy']),
        ];
    }

    /**
     * Display a listing of permissions.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 10);

        // Validate per_page to prevent abuse
        $perPage = in_array($perPage, [10, 20, 30, 40, 50]) ? $perPage : 10;

        $permissions = Permission::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('permission/index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $request->search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission): Response
    {
        $permission->load(['roles']);

        return Inertia::render('permission/show', [
            'permission' => $permission,
        ]);
    }
}
