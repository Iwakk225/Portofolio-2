<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

trait UploadsToCloudinary
{
    /**
     * Upload a file to Cloudinary. Falls back to local storage on failure.
     *
     * @param  UploadedFile  $file        The uploaded file instance.
     * @param  string        $folder      Cloudinary folder name (must match folder you created in Cloudinary dashboard).
     * @param  string        $localDir    Local fallback sub-directory inside storage/app/public.
     * @return string                     The stored URL (Cloudinary secure_url or local /storage/... path).
     */
    protected function uploadToCloudinary(UploadedFile $file, string $folder, string $localDir): string
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey    = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        if ($cloudName && $apiKey && $apiSecret) {
            $timestamp  = time();
            $signString = "folder={$folder}&timestamp={$timestamp}";
            $signature  = sha1($signString . $apiSecret);

            try {
                $response = Http::asMultipart()->post(
                    "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload",
                    [
                        'file'      => fopen($file->getRealPath(), 'r'),
                        'folder'    => $folder,
                        'timestamp' => $timestamp,
                        'signature' => $signature,
                        'api_key'   => $apiKey,
                    ]
                );

                if ($response->successful() && $response->json('secure_url')) {
                    return $response->json('secure_url');
                }
            } catch (\Exception $e) {
                // Fall through to local storage below
            }
        }

        // Local fallback
        $path = $file->store($localDir, 'public');
        return Storage::url($path);
    }

    /**
     * Delete an image from Cloudinary (or local storage if it's a local path).
     *
     * @param  string  $url  The URL of the image to delete.
     */
    protected function deleteFromCloudinary(string $url): void
    {
        if (str_contains($url, 'cloudinary.com')) {
            // Extract public_id including folder, e.g. "projects/abc123"
            if (preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/i', $url, $matches)) {
                $publicId  = $matches[1];
                $cloudName = env('CLOUDINARY_CLOUD_NAME');
                $apiKey    = env('CLOUDINARY_API_KEY');
                $apiSecret = env('CLOUDINARY_API_SECRET');

                if ($cloudName && $apiKey && $apiSecret) {
                    $timestamp  = time();
                    $signString = "public_id={$publicId}&timestamp={$timestamp}";
                    $signature  = sha1($signString . $apiSecret);

                    try {
                        Http::asMultipart()->post(
                            "https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy",
                            [
                                'public_id' => $publicId,
                                'timestamp' => $timestamp,
                                'signature' => $signature,
                                'api_key'   => $apiKey,
                            ]
                        );
                    } catch (\Exception $e) {
                        // Fail silently — deletion errors are non-critical
                    }
                }
            }
        } else {
            // Local file: strip "/storage/" prefix and delete
            $localPath = ltrim(str_replace('/storage', '', parse_url($url, PHP_URL_PATH)), '/');
            Storage::disk('public')->delete($localPath);
        }
    }
}
