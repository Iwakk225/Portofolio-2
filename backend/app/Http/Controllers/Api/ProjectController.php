<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Traits\UploadsToCloudinary;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    use UploadsToCloudinary;

    /** Cloudinary folder name (must match folder created in Cloudinary dashboard) */
    private const CLOUDINARY_FOLDER = 'projects';

    /**
     * Display a listing of projects.
     */
    public function index()
    {
        return response()->json(Project::all());
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
            'tech_stack'  => ['required'],
            'demo_url'    => ['nullable', 'url', 'max:255'],
            'github_url'  => ['nullable', 'url', 'max:255'],
        ]);

        $project              = new Project();
        $project->title       = $validated['title'];
        $project->description = $validated['description'];
        $project->demo_url    = $validated['demo_url'] ?? null;
        $project->github_url  = $validated['github_url'] ?? null;

        // Decode tech_stack if sent as JSON string (multipart/form-data)
        $techStack          = $request->input('tech_stack');
        $project->tech_stack = is_array($techStack) ? $techStack : json_decode($techStack, true);

        if ($request->hasFile('image')) {
            $project->image = $this->uploadToCloudinary(
                $request->file('image'),
                self::CLOUDINARY_FOLDER,
                'projects'
            );
        }

        $project->save();

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => $project,
        ], 201);
    }

    /**
     * Update the specified project.
     * File uploads require POST (routed accordingly in api.php).
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image'       => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:5120'],
            'tech_stack'  => ['required'],
            'demo_url'    => ['nullable', 'url', 'max:255'],
            'github_url'  => ['nullable', 'url', 'max:255'],
        ]);

        $project->title       = $validated['title'];
        $project->description = $validated['description'];
        $project->demo_url    = $validated['demo_url'] ?? null;
        $project->github_url  = $validated['github_url'] ?? null;

        $techStack           = $request->input('tech_stack');
        $project->tech_stack = is_array($techStack) ? $techStack : json_decode($techStack, true);

        if ($request->hasFile('image')) {
            // Delete the old image from Cloudinary or local storage
            if ($project->image) {
                $this->deleteFromCloudinary($project->image);
            }

            $project->image = $this->uploadToCloudinary(
                $request->file('image'),
                self::CLOUDINARY_FOLDER,
                'projects'
            );
        }

        $project->save();

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project,
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project)
    {
        if ($project->image) {
            $this->deleteFromCloudinary($project->image);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully.',
        ]);
    }
}
