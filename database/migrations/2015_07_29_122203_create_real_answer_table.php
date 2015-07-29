<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRealAnswerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('real_answers', function (Blueprint $table) {
            $table->integer('reply_id')->unsigned()->index();
            $table->foreign('reply_id')->references('id')->on('replies')->ondelete('cascade');
            $table->integer('answer_id')->unsigned()->index()->nullable();
            $table->foreign('answer_id')->references('id')->on('answers')->ondelete('cascade');
            $table->string('input')->nullable();
            $table->boolean('unknown');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('real_answers');
    }
}
