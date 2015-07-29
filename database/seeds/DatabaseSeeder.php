<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    protected $tables = [
        'question_types',
        'sections',
        'questions',
        'answers',
        'replies',
        'residences'
    ];

    protected $seeders = [
        'QuestionTypeTableSeeder',
        'QuestionAnswerTableSeeder',
        'ResidenceTableSeeder'
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
