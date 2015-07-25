<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateResidenceRequest;
use App\Models\Residence;

class ResidenceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(CreateResidenceRequest $request)
    {
        $residence = Residence::firstOrCreate($request->all());

        return response()->json(array(
            'error' => false,
            'residence' => $residence
        ));
    }
}
