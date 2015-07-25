<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Residence extends Eloquent
{
    protected $table = 'residences';

    protected $fillable = ['postalCode' , 'city', 'street', 'number', 'lat', 'lon'];

    protected $hidden = ['id'];

}