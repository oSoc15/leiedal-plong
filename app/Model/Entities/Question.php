<?php

namespace app\Model\Entities;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Question extends Eloquent
{
    protected $table = 'questions';

    protected $fillable = ['title' , 'description', 'input'];

    public function question_type()
    {
        return $this->hasOne('App\Model\Entities\QuestionType');
    }

    public function answers()
    {
        return $this->hasMany('App\Model\Entities\Answer');
    }
}
