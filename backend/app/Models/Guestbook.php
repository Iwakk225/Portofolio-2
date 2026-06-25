<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guestbook extends Model
{
    protected $table = 'guestbook'; // Specify because the table is singular in migration 'guestbook'

    protected $fillable = [
        'name',
        'message',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
    ];
}
