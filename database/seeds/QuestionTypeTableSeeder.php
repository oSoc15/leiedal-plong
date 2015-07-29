<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Models\QuestionType;

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
        $types = array('yes_no', 'button', 'slider', 'input', 'multi');
        foreach ($types as $type) {
            $test = QuestionType::create(array(
                'type' => $type
            ));
        }
    }
}
