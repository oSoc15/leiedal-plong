<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    protected $tables = [
        'question_answer',
        'question_types',
        'questions',
        'answers',
    ];

    protected $seeders = [
        'QuestionTypeTableSeeder',
        'QuestionAnswerTableSeeder',
    ];

    /**
     * Run the database seeds.
     */
    public function run()
    {
        Model::unguard();

        $this->cleanDatabase();

        foreach ($this->seeders as $seeder) {
            $this->call($seeder);
        }

    }

    public function cleanDatabase()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        foreach ($this->tables as $table) {
            DB::table($table)->truncate();
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
