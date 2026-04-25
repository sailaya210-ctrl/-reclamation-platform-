<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;

// AUTH public
Route::post('/login', [AuthController::class, 'login']);

// TICKETS publics pour test
Route::get('/tickets', [TicketController::class, 'index']);
Route::put('/tickets/{id}/status', [TicketController::class, 'updateStatus']);
Route::put('/tickets/{id}/priority', [TicketController::class, 'updatePriority']);
Route::put('/tickets/{id}/assign', [TicketController::class, 'assign']);
Route::post('/tickets/{id}/comment', [TicketController::class, 'addComment']);

// ROUTES protégées
Route::middleware('auth:api')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me',       [AuthController::class, 'me']);

    Route::post('/tickets',        [TicketController::class, 'store']);
    Route::get('/tickets/{id}',    [TicketController::class, 'show']);
    Route::put('/tickets/{id}',    [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    Route::get('/stats',           [TicketController::class, 'stats']);

    Route::get('/messages/contacts', [MessageController::class, 'contacts']);
    Route::get('/messages/unread',   [MessageController::class, 'unreadCount']);
    Route::get('/messages/{userId}', [MessageController::class, 'conversation']);
    Route::post('/messages',         [MessageController::class, 'send']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/users',         [UserController::class, 'index']);
        Route::post('/users',        [UserController::class, 'store']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});
