<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    /**
     * Display a listing of skills.
     */
    public function index()
    {
        return response()->json(Skill::all());
    }

    /**
     * Store a newly created skill.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:Frontend,Backend,Tools'],
            'level' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'message' => 'Skill created successfully.',
            'skill' => $skill
        ], 201);
    }

    /**
     * Update the specified skill.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:Frontend,Backend,Tools'],
            'level' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $skill->update($validated);

        return response()->json([
            'message' => 'Skill updated successfully.',
            'skill' => $skill
        ]);
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'message' => 'Skill deleted successfully.'
        ]);
    }
}
