<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\Education;
use App\Models\Project;
use App\Models\Guestbook;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        User::create([
            'name' => 'Admin Developer',
            'email' => 'muhammadadityarahmansyah18@gmail.com',
            'password' => Hash::make('Adit_2026#'),
        ]);

        // 2. Seed Initial Profile
        Profile::create([
            'avatar' => null, // Default placeholder can be handled in React
            'bio_title' => 'Full-Stack Developer & Anime Enthusiast',
            'about_me' => 'Hello! I am a software engineer specializing in Laravel, React, and Tailwind CSS. I construct robust APIs and modern, responsive single page applications. Drawing inspiration from clean anime aesthetics, I focus on neat lines, bold borders, and high usability.',
            'cv_link' => null,
            'rpg_stats' => [
                'Backend Power' => 90,
                'Frontend Agility' => 85,
                'Database Shield' => 80,
                'Git Dexterity' => 75,
                'API Speed' => 88
            ]
        ]);

        // 3. Seed Sample Skills
        $skills = [
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 90],
            ['name' => 'React.js', 'category' => 'Frontend', 'level' => 85],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 95],
            ['name' => 'MySQL / SQLite', 'category' => 'Backend', 'level' => 80],
            ['name' => 'Git / GitHub', 'category' => 'Tools', 'level' => 85],
            ['name' => 'Vite', 'category' => 'Tools', 'level' => 80],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }

        // 4. Seed Sample Educations
        Education::create([
            'institution' => 'University of Tech & Manga',
            'degree' => 'Bachelor of Computer Science',
            'start_year' => 2021,
            'end_year' => 2025,
            'description' => 'Graduated with Honors. Specialized in Web Development and Software Architecture.'
        ]);

        Education::create([
            'institution' => 'Manga Coding Academy',
            'degree' => 'Full-Stack Developer Bootcamp Certificate',
            'start_year' => 2020,
            'end_year' => 2020,
            'description' => 'Intensive training on Laravel REST APIs, SPA architectures, and Tailwind CSS styling.'
        ]);

        // 5. Seed Sample Projects
        Project::create([
            'title' => 'Manga Reader App',
            'description' => 'A clean and minimalist comic reader app featuring neo-brutalist panel views, bookmarks, and a robust search API.',
            'image' => null,
            'tech_stack' => ['Laravel', 'React', 'Tailwind', 'SQLite'],
            'demo_url' => 'https://manga-reader-demo.example.com',
            'github_url' => 'https://github.com/admin/manga-reader'
        ]);

        Project::create([
            'title' => 'Task Dojo',
            'description' => 'Gamified project management tool styled as an RPG adventure where completing tasks awards XP and level-ups.',
            'image' => null,
            'tech_stack' => ['React', 'Vite', 'Tailwind', 'Sanctum'],
            'demo_url' => 'https://task-dojo-demo.example.com',
            'github_url' => 'https://github.com/admin/task-dojo'
        ]);

        // 6. Seed Sample Guestbook Messages
        Guestbook::create([
            'name' => 'Saitama',
            'message' => 'Awesome website! It loaded in one punch! 👊🔥',
            'is_approved' => true
        ]);

        Guestbook::create([
            'name' => 'Goku',
            'message' => 'Can this portfolio handle power level over 9000?! Let\'s fight!',
            'is_approved' => false // Unapproved, requires admin moderation
        ]);
    }
}
