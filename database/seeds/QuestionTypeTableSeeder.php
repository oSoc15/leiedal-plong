<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Model\Entities\QuestionType;

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
                'type' => $type
            ));
        }
    }
}
