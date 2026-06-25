<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'educations'; // Explicit table name just in case

    protected $fillable = [
        'institution',
        'degree',
        'start_year',
        'end_year',
        'description',
    ];
}
