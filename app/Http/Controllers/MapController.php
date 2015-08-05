<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MapController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $lat = 50.8086126;
        $lon = 3.2469894;
        $zoom = 10;
        return View('map', array('lat' => $lat, 'lon' => $lon,'zoom' => $zoom));
    }

}
