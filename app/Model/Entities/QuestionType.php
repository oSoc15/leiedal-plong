<?php

namespace App\Model\Entities;

use Illuminate\Database\Eloquent\Model;

/**
 * A class which represents the different types a question can have.
 */
class QuestionType extends Model
{

    protected $table = ['question_types'];

    protected $fillable = ['type'];
}
