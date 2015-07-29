<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Answer extends Eloquent
{
    protected $table = 'answers';

    protected $fillable = ['title', 'image', 'weight'];

    public $timestamps = false;

    public function question()
    {
        return $this->belongsTo('App\Models\Question');
    }

    public function reply()
    {
        return $this->belongsTo('App\Models\Reply');
    }

    public function real_answer()
    {
        return $this->belongsTo('App\Models\RealAnswer');
    }
}
