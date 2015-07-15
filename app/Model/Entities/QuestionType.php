<?php

namespace App\Model\Entities;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * A class which represents the different types a question can have.
 */
class QuestionType extends Eloquent
{
    protected $table = 'question_types';

    protected $fillable = ['type'];
}
