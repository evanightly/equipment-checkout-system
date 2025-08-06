<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', App\Http\Controllers\UserController::class);
    Route::resource('roles', App\Http\Controllers\RoleController::class);
    Route::resource('permissions', App\Http\Controllers\PermissionController::class)->only(['index', 'show']);

    // Division management (SuperAdmin only)
    Route::resource('divisions', App\Http\Controllers\DivisionController::class);

    // Equipment management (All roles can view, Admin+ can manage)
    Route::resource('equipment', App\Http\Controllers\EquipmentController::class);

    // Equipment User management (formerly Borrowing system)
    Route::prefix('equipment-users')->name('equipment-users.')->group(function () {
        Route::get('/', [App\Http\Controllers\EquipmentUserController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\EquipmentUserController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\EquipmentUserController::class, 'store'])->name('store');
        Route::get('/{borrowing}', [App\Http\Controllers\EquipmentUserController::class, 'show'])->name('show');
        Route::patch('/{borrowing}/approve', [App\Http\Controllers\EquipmentUserController::class, 'approve'])->name('approve');
        Route::patch('/{borrowing}/reject', [App\Http\Controllers\EquipmentUserController::class, 'reject'])->name('reject');
        Route::patch('/{borrowing}/return', [App\Http\Controllers\EquipmentUserController::class, 'return'])->name('return');
        Route::delete('/{borrowing}', [App\Http\Controllers\EquipmentUserController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
