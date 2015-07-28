<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Residence;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Reply;
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

    public function reply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'residence' => 'required',
            'question' => 'required',
            'unknown' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(array(
                'error' => true,
                'message' => 'The request can not be parsed',
            ));
        }

        // check if there is an already a reply to this question
        $oldReply = Reply::whereHas('question', function ($q) use ($request) {
            $q->where('question_id', $request->input('question'));
        })->first();

        // find the corresponding residence and question
        $residence = Residence::findOrFail(Hashids::decode($request->input('residence')))->first();
        $question = Question::findOrFail($request->input('question'));

        if (count($oldReply)) {
            $reply = $oldReply->fillReply($request->all());
        } else {
            $reply = new Reply();
            $reply = $reply->fillReply($request->all());
            $reply->question()->associate($question);
        }

        $residence->replies()->save($reply);
        $nextQuestion = Question::findOrFail($question->next_question)->load('answers');

        return response()->json(array(
            'residence' => $residence,
            'question' => $nextQuestion
        ));
    }
}
