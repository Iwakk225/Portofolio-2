<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Skill;
use App\Models\Achievement;
use App\Models\Education;
use App\Models\Project;
use Illuminate\Database\Seeder;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create default profile
        Profile::firstOrCreate(
            [],
            [
                'bio_title' => 'Full Stack Developer',
                'about_me' => 'Passionate developer building amazing web experiences',
                'rpg_stats' => [
                    ['stat' => 'Creativity', 'value' => 85],
                    ['stat' => 'Problem Solving', 'value' => 90],
                    ['stat' => 'Communication', 'value' => 80],
                    ['stat' => 'Leadership', 'value' => 75],
                ],
            ]
        );

        // Create sample skills
        $skills = [
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 'Expert'],
            ['name' => 'React', 'category' => 'Frontend', 'level' => 'Expert'],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'level' => 'Advanced'],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 'Expert'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(
                ['name' => $skill['name']],
                $skill
            );
        }

        // Create sample achievement
        Achievement::firstOrCreate(
            ['title' => 'First Project Deployed'],
            [
                'title' => 'First Project Deployed',
                'issuer' => 'Self',
                'description' => 'Successfully deployed my first web application',
                'date' => now()->subMonths(6),
            ]
        );

        // Create sample education
        Education::firstOrCreate(
            ['institution' => 'Self-Taught'],
            [
                'institution' => 'Self-Taught',
                'degree' => 'Full Stack Web Development',
                'start_year' => now()->subYears(3)->year,
                'end_year' => now()->year,
            ]
        );

        // Create sample project
        Project::firstOrCreate(
            ['title' => 'Portfolio Website'],
            [
                'title' => 'Portfolio Website',
                'description' => 'Modern portfolio built with Laravel and React',
                'tech_stack' => ['Laravel', 'React', 'Tailwind CSS'],
            ]
        );
    }
}
