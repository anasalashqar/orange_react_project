<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public blog routes
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{blog}', [BlogController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User routes
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    
    // Content routes
    Route::get('/content', [ContentController::class, 'index']);
    Route::post('/content', [ContentController::class, 'store']);
    Route::get('/content/{content}', [ContentController::class, 'show']);
    Route::put('/content/{content}', [ContentController::class, 'update']);
    Route::delete('/content/{content}', [ContentController::class, 'destroy']);
    Route::post('/content/{content}/like', [ContentController::class, 'like']);
    Route::post('/content/{content}/comments', [ContentController::class, 'addComment']);
    
    // Blog routes - protected operations
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog}', [BlogController::class, 'destroy']);
    Route::post('/blogs/{blog}/comments', [BlogController::class, 'addComment']);
    Route::post('/blogs/{blog}/like', [BlogController::class, 'like']);
    Route::get('/my-blogs', [BlogController::class, 'userBlogs']);
});