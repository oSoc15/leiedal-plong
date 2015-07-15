<?php

namespace app\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Model\Entities\Question;
use Illuminate\Http\Response;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        return response()->json(Question::all());
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
        return response()->json(Question::findOrFail($id)->with('answers')->get());
    }
}
