<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('questions', function (blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->boolean('unknown');
            $table->text('description');
            $table->boolean('ignore');
            $table->integer('from')->nullable();
            $table->integer('till')->nullable();
            $table->integer('question_type')->unsigned();
            $table->foreign('question_type')->references('id')->on('question_types')->ondelete('cascade');
            $table->integer('next_question')->unsigned()->nullable();
            $table->foreign('next_question')->references('id')->on('questions')->ondelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::drop('questions');
    }
}
