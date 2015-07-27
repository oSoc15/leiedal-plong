<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Vinkla\Hashids\Facades\Hashids;

class Answer extends Eloquent
{
    protected $table = 'answers';

    protected $fillable = ['title', 'image', 'weight'];

    protected $appends = ['hashid'];

    public $timestamps = false;

    public function questions()
    {
        return $this->belongsToMany('App\Models\Question');
    }

    public function residences()
    {
        return $this->belongsToMany('App\Models\Residences');
    }

    public function getHashidAttribute()
    {
        return Hashids::encode($this->attributes['id']);
    }
}
