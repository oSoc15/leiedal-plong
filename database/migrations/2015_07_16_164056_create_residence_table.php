<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateResidenceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('residences', function (Blueprint $table) {
            $table->increments('id');
            $table->string('street')->required();
            $table->string('city')->required();
            $table->string('ecolabel')->nullable();
            $table->integer('postalCode')->required();
            $table->integer('number')->required();
            $table->float('lat');
            $table->float('lon');
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
        Schema::drop('residences');
    }
}
