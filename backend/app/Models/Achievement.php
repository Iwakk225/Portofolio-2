<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'title',
        'issuer',
        'date',
        'description',
        'certificate_img',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
