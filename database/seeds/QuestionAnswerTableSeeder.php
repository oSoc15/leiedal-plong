<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Model\Entities\Question;
use App\Model\Entities\Answer;

/**
 * QuestionAnswerTableSeeder.
 */
class QuestionAnswerTableSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run()
    {
        Question::create(array(
            'title' => 'Mijn vloer is',
            'description' => 'Isolatie via het kelderplafond is zichtbaar in je kelder. Werd je vloer geïsoleerd op volle grond, dan ligt je vloerbedekking meestal iets hoger.',
            'input' => false,
            'question_type' => 1,
        ));
    }
}
