<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Answer extends Eloquent
{
    protected $table = 'answers';

    protected $fillable = ['title', 'image', 'weight'];

    public $timestamps = false;

    public function questions()
    {
        return $this->belongsToMany('App\Models\Question');
    }

}