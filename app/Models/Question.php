<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Question extends Eloquent
{
    protected $table = 'questions';

    protected $fillable = ['title' , 'description', 'unknown'];

    protected $hidden = ['question_type'];

    protected $appends = ['type'];

    public $timestamps = false;

    public function answers()
    {
        return $this->hasMany('App\Models\Answer');
    }

    public function question_type()
    {
        return $this->hasOne('App\Models\QuestionType');
    }

    public function getTypeAttribute()
    {
        return QuestionType::find($this->question_type)->getAttribute('type');
    }
}
