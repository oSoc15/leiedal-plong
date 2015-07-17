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
            $table->string('street');
            $table->string('city');
            $table->string('ecolabel')->nullable();
            $table->integer('postalCode');
            $table->integer('number');
            $table->float('lat');
            $table->float('lon');
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
