<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Guestbook;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test public profile fetch.
     */
    public function test_can_fetch_profile(): void
    {
        // Setup profile
        $profile = Profile::create([
            'bio_title' => 'Web Dev',
            'about_me' => 'Hello World',
            'rpg_stats' => ['PHP' => 90]
        ]);

        $response = $this->getJson('/api/profile');

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'bio_title' => 'Web Dev',
                     'about_me' => 'Hello World',
                 ]);
    }

    /**
     * Test public skills fetch.
     */
    public function test_can_fetch_skills(): void
    {
        // Setup skill
        Skill::create([
            'name' => 'Laravel',
            'category' => 'Backend',
            'level' => 90
        ]);

        $response = $this->getJson('/api/skills');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment([
                     'name' => 'Laravel',
                     'category' => 'Backend',
                     'level' => 90
                 ]);
    }

    /**
     * Test guestbook public submission.
     */
    public function test_public_can_submit_guestbook_message(): void
    {
        $response = $this->postJson('/api/guestbook', [
            'name' => 'Ichigo',
            'message' => 'Bankai! Great website.'
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'name' => 'Ichigo',
                     'message' => 'Bankai! Great website.',
                     'is_approved' => false // Unapproved by default
                 ]);

        $this->assertDatabaseHas('guestbook', [
            'name' => 'Ichigo',
            'is_approved' => false
        ]);
    }

    /**
     * Test guestbook public list only contains approved messages.
     */
    public function test_guestbook_only_displays_approved_messages(): void
    {
        Guestbook::create([
            'name' => 'Approved User',
            'message' => 'Hello!',
            'is_approved' => true
        ]);

        Guestbook::create([
            'name' => 'Pending User',
            'message' => 'Moderated!',
            'is_approved' => false
        ]);

        $response = $this->getJson('/api/guestbook');

        $response->assertStatus(200)
                 ->assertJsonCount(1)
                 ->assertJsonFragment([
                     'name' => 'Approved User'
                 ])
                 ->assertJsonMissing([
                     'name' => 'Pending User'
                 ]);
    }

    /**
     * Test guestbook admin moderation endpoint security.
     */
    public function test_unauthenticated_user_cannot_access_admin_endpoints(): void
    {
        $response = $this->getJson('/api/admin/guestbook');
        $response->assertStatus(401);
    }

    /**
     * Test login functionality.
     */
    public function test_admin_can_login_with_valid_credentials(): void
    {
        $user = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password123'
        ], [
            'Referer' => 'http://localhost'
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'email' => 'admin@test.com'
                 ]);
    }

    /**
     * Test login rate limiter.
     */
    public function test_login_endpoint_has_rate_limiting(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/login', [
                'email' => 'wrong@test.com',
                'password' => 'wrongpass'
            ], [
                'Referer' => 'http://localhost'
            ]);
            $response->assertStatus(422);
        }

        // 6th attempt should trigger 429 Too Many Requests
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@test.com',
            'password' => 'wrongpass'
        ], [
            'Referer' => 'http://localhost'
        ]);

        $response->assertStatus(429);
    }
}
