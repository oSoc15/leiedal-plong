<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Question extends Eloquent
{
    protected $table = 'questions';

    protected $fillable = ['title' , 'description', 'unknown', 'next_question', 'ignore'];

    protected $hidden = ['question_type', 'section_id'];

    protected $appends = ['type', 'section'];

    public $timestamps = false;

    public function answers()
    {
        return $this->hasMany('App\Models\Answer');
    }

    public function questionType()
    {
        return $this->hasOne('App\Models\QuestionType');
    }

    public function reply()
    {
        return $this->belongsTo('App\Models\Reply');
    }

    public function getTypeAttribute()
    {
        return QuestionType::find($this->question_type)->getAttribute('type');
    }

    public function nextQuestion()
    {
        return $this->hasOne('App\Models\Question');
    }

    public function getNextQuestion()
    {
        return Question::find($this->next_question);
    }

    public function getSectionAttribute()
    {
        return Section::find($this->section_id)->getAttribute('title');
    }
}
