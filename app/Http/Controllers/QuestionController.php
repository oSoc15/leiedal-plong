<?php

namespace app\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Model\Entities\Question;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
       dd(Question::all()); 
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     *
     * @return Response
     */
    public function show($id)
    {
        //
    }
}