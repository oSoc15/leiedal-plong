<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Section extends Eloquent
{
    protected $table = 'sections';

    protected $fillable  = ['title'];

    public $timestamps = false;

    public function questions()
    {
        return $this->hasMany('App\Models\Question');
    }
}
