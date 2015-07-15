<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Model\Entities\Question;
use App\Model\Entities\QuestionType;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Model::unguard();

        $this->call('QuestionTypeTableSeeder');
        $this->command->info('QuestionTypes are seeded');
        $this->call('QuestionAnswerTableSeeder');
        $this->command->info('Question and answers are seeded');
    }
}

/**
 * QuestionTypeTableSeeder.
 */
class QuestionTypeTableSeeder extends Seeder
{
    /**
     * Run the seeder.
     */
    public function run()
    {
        $types = array('YES_NO', 'BUTTON', 'SLIDER');
        foreach ($types as $type) {
            QuestionType::create(array(
                'type' => $type,
            ));
        }
    }
}

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
