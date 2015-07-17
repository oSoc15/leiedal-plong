<?php

namespace App\Models;

class Residence
{

    protected $table = 'questions';

    protected $fillable = ['postalCode' , 'city', 'street', 'number', 'lat', 'lon'];

}
