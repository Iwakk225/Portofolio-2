<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guestbook;
use Illuminate\Http\Request;

class GuestbookController extends Controller
{
    /**
     * Display a listing of approved guestbook entries (Public).
     */
    public function index()
    {
        $messages = Guestbook::where('is_approved', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    /**
     * Store a newly created guestbook entry (Public submission).
     * By default, it is unapproved (requires moderation).
     */
    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $message = Guestbook::create([
            'name' => $validated['name'],
            'message' => $validated['message'],
            'is_approved' => false, // Always false upon public creation
        ]);

        return response()->json([
            'message' => 'Your message has been submitted and is awaiting administrator moderation.',
            'entry' => $message
        ], 201);
    }

    /**
     * Display all guestbook entries for admin moderation (Admin).
     */
    public function indexAdmin()
    {
        $messages = Guestbook::orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    /**
     * Approve a guestbook entry (Admin).
     */
    public function approve(Guestbook $guestbook)
    {
        $guestbook->update(['is_approved' => true]);

        return response()->json([
            'message' => 'Message approved successfully.',
            'entry' => $guestbook
        ]);
    }

    /**
     * Remove the specified guestbook entry (Admin).
     */
    public function destroy(Guestbook $guestbook)
    {
        $guestbook->delete();

        return response()->json([
            'message' => 'Guestbook entry deleted successfully.'
        ]);
    }
}
