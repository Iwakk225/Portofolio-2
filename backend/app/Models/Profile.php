<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'avatar',
        'bio_title',
        'about_me',
        'cv_link',
        'rpg_stats',
    ];

    protected $casts = [
        'rpg_stats' => 'array',
    ];
}
