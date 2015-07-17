<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSectionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (blueprint $table) {
            $table->increments('id');
            $table->string('title');
        });

        Schema::table('questions', function (blueprint $table) {
            $table->integer('section_id')->unsigned()->index();
            $table->foreign('section_id')->references('id')->on('sections')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('questions', function (blueprint $table) {
            $table->dropForeign('questions_section_id_foreign');
            $table->dropColumn('section_id');
        });
        Schema::drop('sections');
    }
}
