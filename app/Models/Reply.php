<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Reply extends Eloquent
{
    protected $table = 'replies';

    protected $fillable = ['unknown', 'input'];

    public function question()
    {
        return $this->belongsTo('App\Models\Question');
    }

    public function answer()
    {
        return $this->belongsTo('App\Models\Answer');
    }

    public function fillReply($data)
    {
        if ($data['answer']) {
            $answer = Answer::findOrFail($data['answer']);
            $this->answer()->associate($answer);
        }

        $this->unknown = $data['unknown'];
        $this->input = $data['input'];

        return $this;
    }
}
