<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestiontypeTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('question_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::drop('question_types');
    }
}
