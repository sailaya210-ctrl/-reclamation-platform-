<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;

// ── AUTH (public) ─────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function() {
    return response()->json(['message' => 'API Bayan fonctionne ✅']);
});

// ── ROUTES PROTÉGÉES ─────────────────────
Route::middleware('auth:api')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me',       [AuthController::class, 'me']);

    Route::get('/tickets',               [TicketController::class, 'index']);
    Route::post('/tickets',              [TicketController::class, 'store']);
    Route::get('/tickets/{id}',          [TicketController::class, 'show']);
    Route::put('/tickets/{id}',          [TicketController::class, 'update']);
    Route::delete('/tickets/{id}',       [TicketController::class, 'destroy']);
    Route::post('/tickets/{id}/comment', [TicketController::class, 'addComment']);
    Route::get('/stats',                 [TicketController::class, 'stats']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/users',         [UserController::class, 'index']);
        Route::post('/users',        [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});