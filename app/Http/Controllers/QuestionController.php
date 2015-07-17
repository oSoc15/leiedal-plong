<?php

namespace app\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\QuestionType;
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
        return Question::findOrFail($id)->with('answers')->where('id', $id)->get();
    }
}
