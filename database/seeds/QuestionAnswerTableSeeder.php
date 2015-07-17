<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Models\Question;
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

        // Gebouw
        $section = Section::find(1);

        $question = Question::create(array(
            'title' => 'Soort',
            'description' => 'Welke soort bebouwing heeft u',
            'unknown' => true,
            'question_type' => 2
        ));

        $answers = [
            new Answer(array(
                'title' => 'Open bebouwing',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => 'Halfopen bebouwing',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => 'Gesloten bebouwing',
                'image' => '',
                'weight' => 1,
            ))
        ];

        foreach ($answers as $answer) {
            $question->answers()->save($answer);
        }

        $section->questions()->save($question);

        // Isolatie
        $section = Section::find(2);

        $question = Question::create(array(
            'title' => 'Kelder',
            'description' => 'Heeft u een kelder?',
            'unknown' => true,
            'question_type' => 1,
        ));

        $section->questions()->save($question);

        $section = Section::find(3);

        $question = Question::create(array(
            'title' => 'Renovatie',
            'description' => 'Wanneer was de laatste renovatie van uw woonst?',
            'unknown' => true,
            'question_type' => 3,
        ));

        $answers = [
            new Answer(array(
                'title' => 'Nooit',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => '< 5 jaar geleden',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => '5-15 jaar geleden',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => '15-25 jaar geleden',
                'image' => '',
                'weight' => 1,
            )),
            new Answer(array(
                'title' => '25 < jaar geleden',
                'image' => '',
                'weight' => 1,
            ))
        ];

        foreach ($answers as $answer) {
            $question->answers()->save($answer);
        }
        $section->questions()->save($question);

        $section = Section::find(3);

        $question = Question::create(array(
            'title' => 'Hernieuwbare energie',
            'description' => 'Maakt u gebruik van hernieuwbare energie?',
            'unknown' => true,
            'question_type' => 4,
        ));

        $answers = [
            new Answer(array(
                'title' => 'Zonnepanelen',
                'image' => '',
                'weight' => 1,
            )), new Answer(array(
                'title' => 'Zonneboiler',
                'image' => '',
                'weight' => 1,
            )),
        ];

        foreach ($answers as $answer) {
            $question->answers()->save($answer);
        }
        $section->questions()->save($question);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
