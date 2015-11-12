<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
use App\Models\QuestionType;
use App\Models\Answer;
use App\Models\Section;

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
        // Don't let foreign keys screw up your jam
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // get questions file from storage/app
        $storage = Storage::get('questions.json');
        $sections = json_decode($storage);

        // loop through the file
        foreach ($sections as $section) {
            $cSection = Section::create(array(
                'title' => $section->title
            ));
            foreach ($section->questions as $question) {
                $cQuestion = Question::create(array(
                    'title' => $question->title,
                    'unknown' => $question->unknown,
                    'description' => $question->description,
                    'from' => $question->from,
                    'till' => $question->till,
                    'next_question' => $question->next_question,
                    'question_type' => $question->type
                ));

                if (property_exists($question, 'answers')) {
                    foreach ($question->answers as $answer) {
                        $cAnswer = Answer::create(array(
                            'title' => $answer->title,
                            'weight' => $answer->weight,
                            'image' => $answer->image
                        ));
                        $cQuestion->answers()->save($cAnswer);
                    }
                }
                $cSection->questions()->save($cQuestion);
            }
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
