<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\AchievementController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\GuestbookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ==========================================
// PUBLIC ROUTES (Read-Only & Guestbook Post)
// ==========================================
Route::get('/profile', [ProfileController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::get('/achievements', [AchievementController::class, 'index']);
Route::get('/educations', [EducationController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/guestbook', [GuestbookController::class, 'index']);
Route::post('/guestbook', [GuestbookController::class, 'storePublic']);

// ==========================================
// AUTHENTICATION ROUTES (Rate Limited)
// ==========================================
Route::middleware(['throttle:login'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// ==========================================
// PROTECTED ADMIN ROUTES (Sanctum Authed)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin Profile Updates (using POST to support file/avatar uploads)
    Route::post('/profile', [ProfileController::class, 'storeOrUpdate']);

    // Admin CRUD - Skills
    Route::apiResource('skills', SkillController::class)->except(['index']);

    // Admin CRUD - Achievements
    Route::post('/achievements', [AchievementController::class, 'store']);
    Route::post('/achievements/{achievement}', [AchievementController::class, 'update']); // POST workaround for PUT files
    Route::delete('/achievements/{achievement}', [AchievementController::class, 'destroy']);

    // Admin CRUD - Educations
    Route::apiResource('educations', EducationController::class)->except(['index']);

    // Admin CRUD - Projects
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::post('/projects/{project}', [ProjectController::class, 'update']); // POST workaround for PUT files
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Admin Moderation - Guestbook
    Route::get('/admin/guestbook', [GuestbookController::class, 'indexAdmin']);
    Route::patch('/guestbook/{guestbook}/approve', [GuestbookController::class, 'approve']);
    Route::delete('/guestbook/{guestbook}', [GuestbookController::class, 'destroy']);
});
