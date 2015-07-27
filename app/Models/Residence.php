<?php

namespace app\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Vinkla\Hashids\Facades\Hashids;

class Residence extends Eloquent
{
    protected $table = 'residences';

    protected $fillable = ['postalCode' , 'city', 'street', 'number', 'lat', 'lon'];

    protected $hidden = ['id'];

    protected $appends = ['hashid'];

    public function answers()
    {
        return $this->belongsToMany('App\Models\Answer');
    }

    public function getHashidAttribute()
    {
        return Hashids::encode($this->attributes['id']);
    }
}
