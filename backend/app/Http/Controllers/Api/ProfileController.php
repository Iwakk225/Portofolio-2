<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Traits\UploadsToCloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    use UploadsToCloudinary;

    /** Cloudinary folder name (must match folder created in Cloudinary dashboard) */
    private const CLOUDINARY_FOLDER = 'User-profile';

    /**
     * Display the single profile.
     */
    public function index()
    {
        $profile = Profile::first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not initialized.'], 404);
        }
        return response()->json($profile);
    }

    /**
     * Create or update the profile.
     */
    public function storeOrUpdate(Request $request)
    {
        $validated = $request->validate([
            'bio_title' => ['required', 'string', 'max:255'],
            'about_me'  => ['required', 'string'],
            'avatar'    => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
            'cv_link'   => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'rpg_stats' => ['nullable', 'string'], // JSON string from multipart/form-data
        ]);

        $profile = Profile::firstOrNew();

        $profile->bio_title = $validated['bio_title'];
        $profile->about_me  = $validated['about_me'];

        // Decode rpg_stats JSON string to array
        if (!empty($validated['rpg_stats'])) {
            $decoded = json_decode($validated['rpg_stats'], true);
            if (is_array($decoded)) {
                $profile->rpg_stats = $decoded;
            }
        }

        // Handle avatar upload → Cloudinary "User-profile" folder
        if ($request->hasFile('avatar')) {
            if ($profile->avatar) {
                $this->deleteFromCloudinary($profile->avatar);
            }
            $profile->avatar = $this->uploadToCloudinary(
                $request->file('avatar'),
                self::CLOUDINARY_FOLDER,
                'avatars'
            );
        }

        // Handle CV/Resume upload → local storage (PDFs not supported by Cloudinary image endpoint)
        if ($request->hasFile('cv_link')) {
            if ($profile->cv_link) {
                $localPath = ltrim(str_replace('/storage', '', parse_url($profile->cv_link, PHP_URL_PATH)), '/');
                Storage::disk('public')->delete($localPath);
            }
            $path = $request->file('cv_link')->store('cvs', 'public');
            $profile->cv_link = Storage::url($path);
        }

        $profile->save();

        return response()->json([
            'message' => 'Profile updated successfully.',
            'profile' => $profile,
        ]);
    }
}
