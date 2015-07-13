<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * A class which represents the different types a question can have.
 */
class QuestionType extends Model
{
    
    /**
     * This defines the id for the yes-noquestion.
     */
    const YES_NO = 1;
    
    /**
     * This defines the id for the buttons-typequestion.
     */
    const BUTTONS = 2;
    
    /**
     * This defines the id for the slider-typequestion.
     */
    const SLIDER = 3;
    
}
