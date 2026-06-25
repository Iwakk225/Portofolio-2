<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Traits\UploadsToCloudinary;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    use UploadsToCloudinary;

    /** Cloudinary folder name (must match folder created in Cloudinary dashboard) */
    private const CLOUDINARY_FOLDER = 'Achievements';

    /**
     * Display a listing of achievements.
     */
    public function index()
    {
        return response()->json(Achievement::orderBy('date', 'desc')->get());
    }

    /**
     * Store a newly created achievement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'issuer'          => ['required', 'string', 'max:255'],
            'date'            => ['required', 'date'],
            'description'     => ['nullable', 'string'],
            'certificate_img' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
        ]);

        // Remove file from validated so it doesn't break mass assignment
        $achievement = new Achievement(collect($validated)->except('certificate_img')->toArray());

        if ($request->hasFile('certificate_img')) {
            $achievement->certificate_img = $this->uploadToCloudinary(
                $request->file('certificate_img'),
                self::CLOUDINARY_FOLDER,
                'achievements'
            );
        }

        $achievement->save();

        return response()->json([
            'message'     => 'Achievement created successfully.',
            'achievement' => $achievement,
        ], 201);
    }

    /**
     * Update the specified achievement.
     * File uploads require POST (routed accordingly in api.php).
     */
    public function update(Request $request, Achievement $achievement)
    {
        $validated = $request->validate([
            'title'           => ['required', 'string', 'max:255'],
            'issuer'          => ['required', 'string', 'max:255'],
            'date'            => ['required', 'date'],
            'description'     => ['nullable', 'string'],
            'certificate_img' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
        ]);

        $achievement->fill(collect($validated)->except('certificate_img')->toArray());

        if ($request->hasFile('certificate_img')) {
            // Delete the old certificate from Cloudinary or local storage
            if ($achievement->certificate_img) {
                $this->deleteFromCloudinary($achievement->certificate_img);
            }

            $achievement->certificate_img = $this->uploadToCloudinary(
                $request->file('certificate_img'),
                self::CLOUDINARY_FOLDER,
                'achievements'
            );
        }

        $achievement->save();

        return response()->json([
            'message'     => 'Achievement updated successfully.',
            'achievement' => $achievement,
        ]);
    }

    /**
     * Remove the specified achievement.
     */
    public function destroy(Achievement $achievement)
    {
        if ($achievement->certificate_img) {
            $this->deleteFromCloudinary($achievement->certificate_img);
        }

        $achievement->delete();

        return response()->json([
            'message' => 'Achievement deleted successfully.',
        ]);
    }
}
