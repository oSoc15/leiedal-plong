<?php

namespace app\Model\Entities;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Answer extends Eloquent
{
    protected $table = 'answers';

    protected $fillable = ['title', 'image', 'weight'];

    public function questions()
    {
        return $this->belongsToMany('App\Model\Entities\Question');
    }
}
