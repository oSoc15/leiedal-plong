<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealAnswer extends Model
{
    protected $table = 'real_answers';

    protected $fillable = ['input'];

    public $timestamps = true;

    public function answer()
    {
        return $this->hasOne('App\Models\Answer', 'id', 'answer_id');
    }

    public function question()
    {
        return $this->hasOne('App\Models\Question');
    }
}
