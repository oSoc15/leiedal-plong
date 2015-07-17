<?php

use Illuminate\Database\Seeder;
use App\Models\Section;

class SectionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $sections = array('Gebouw', 'Isolatie', 'Wonen');
        foreach ($sections as $section) {
            Section::create(array(
                'title' => $section
            ));
        }
    }
}
