<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnswerResidencePivotTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('answer_residence', function (Blueprint $table) {
            $table->integer('answer_id')->unsigned()->index();
            $table->foreign('answer_id')->references('id')->on('answers')->onDelete('cascade');
            $table->integer('residence_id')->unsigned()->index();
            $table->foreign('residence_id')->references('id')->on('residences')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::drop('answer_residence');
    }
}
