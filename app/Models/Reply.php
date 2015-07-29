<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Reply extends Eloquent
{
    protected $table = 'replies';

    protected $fillable = ['unknown', 'input'];

    public function real_answers()
    {
        return $this->hasMany('App\Models\RealAnswer');
    }

    public function question()
    {
        return $this->hasOne('App\Models\Question');
    }
}
