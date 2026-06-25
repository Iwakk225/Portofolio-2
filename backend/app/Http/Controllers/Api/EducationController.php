<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * Display a listing of educations.
     */
    public function index()
    {
        return response()->json(Education::orderBy('start_year', 'desc')->get());
    }

    /**
     * Store a newly created education.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['required', 'string', 'max:255'],
            'start_year' => ['required', 'integer', 'min:1900', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1900', 'max:2100', 'gte:start_year'],
            'description' => ['nullable', 'string'],
        ]);

        $education = Education::create($validated);

        return response()->json([
            'message' => 'Education created successfully.',
            'education' => $education
        ], 201);
    }

    /**
     * Update the specified education.
     */
    public function update(Request $request, Education $education)
    {
        $validated = $request->validate([
            'institution' => ['required', 'string', 'max:255'],
            'degree' => ['required', 'string', 'max:255'],
            'start_year' => ['required', 'integer', 'min:1900', 'max:2100'],
            'end_year' => ['nullable', 'integer', 'min:1900', 'max:2100', 'gte:start_year'],
            'description' => ['nullable', 'string'],
        ]);

        $education->update($validated);

        return response()->json([
            'message' => 'Education updated successfully.',
            'education' => $education
        ]);
    }

    /**
     * Remove the specified education.
     */
    public function destroy(Education $education)
    {
        $education->delete();

        return response()->json([
            'message' => 'Education deleted successfully.'
        ]);
    }
}
