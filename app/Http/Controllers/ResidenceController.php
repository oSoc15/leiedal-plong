<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ResidenceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $input = request->all();
        $residence = new Residence;
        $residence->street = $input('street');
        $residence->city = $input('city');
        $residence->postalCode = $input('postalCode');
        $residence->number = $input('number');
        $residence->lat = $input('lat');
        $residence->long = $input('long');

        $residence->save();

        return Response::json(array(
            'error' => false,
            'residence' => $residence->toArray(),
            200
        ));
    }
}
