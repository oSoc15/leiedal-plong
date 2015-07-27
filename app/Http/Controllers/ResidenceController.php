<?php

namespace app\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Residence;
use App\Models\Question;
use App\Models\Answer;
use Vinkla\Hashids\Facades\Hashids;

class ResidenceController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'street' => 'required',
            'city' => 'required',
            'number' => 'required',
            'postalCode' => 'required',
            'lat' => 'required',
            'lon' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(array(
                'error' => true,
                'message' => 'The resource can not be made',
            ));
        }

        $residence = Residence::firstOrCreate($request->all());

        // check for firstQuestion attribute
        $question = Question::findOrFail(1)->load('answers');

        return response()->json(array(
            'error' => false,
            'residence' => $residence,
            'question' => $question,
        ));
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
        return Residence::findOrFail($id);
    }

    public function response(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'residence' => 'required',
            'answer' => 'required',
            'question' => 'required',
            'unknown' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(array(
                'error' => true,
                'message' => 'The request can not be parsed',
            ));
        }

        $residence = Residence::findOrFail(Hashids::decode($data['residence']))[0];
        // TODO: look for the answers in the questions, not on the whole collection
        $answer = Answer::findOrFail(Hashids::decode($data['answer']))[0];
        $question = Question::findOrFail($data['question']);

        $nextQuestion = Question::findOrFail($question->next_question)->load('answers');

        $residence->answers()->save($answer);

        return response()->json(array(
            'residence' => $residence,
            'question' => $nextQuestion
        ));
    }
}
