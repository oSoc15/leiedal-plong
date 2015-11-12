<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Models\Residence;
use App\Models\Question;
use App\Models\Answer;
use App\Models\RealAnswer;
use App\Models\Reply;
use Vinkla\Hashids\Facades\Hashids;

class ResidenceController extends Controller
{
    /**
     * provide to route for the angular application
     * @return type
     */
    public function index()
    {
        return View('questionnaire');
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     *
     * @return Response
     */
    public function store(Request $request)
    {
        // http://localhost:82/plong/public/api/residences?street=test&city=gent&number=5

        $validator = Validator::make($request->all(), [
            'street' => 'required',
            'city' => 'required',
            'number' => 'required'
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
            'error' => $request->all(),
            'residence' => $residence,
            'question' => $question,
        ));
    }


    /**
     * Display all the resources.
     *
     * @return Response
     */
    public function getAll()
    {
        $res = Residence::All()->load('replies.real_answers.answer.question');
        $fres = [];

        foreach($res as $k => $v) {

            $item['Id'] = $v['id'];
            $item['Adres Lang'] = $v['street'] . ' ' . $v['number'] . ', ' . $v['city'];
            $item['Ecoscore'] = 0;
            $item['Adres']['Straat'] = $v['street'];
            $item['Adres']['Nummer'] = $v['number'];
            $item['Adres']['Stad'] = $v['city'];

            foreach($v['replies'] as $l => $w) {
                $item['Bevraging'][$l]['Vraag'] =
                    $w['real_answers'][0]['answer']['question']['description'];

                if($w['real_answers'][0]['input']) {
                    $item['Bevraging'][$l]['Antwoord'] =
                        $w['real_answers'][0]['input'];
                } else {
                    $item['Bevraging'][$l]['Antwoord'] =
                        $w['real_answers'][0]['answer']['title'];
                }

                $item['Bevraging'][$l]['Gewicht'] =
                    $w['real_answers'][0]['answer']['weight'];

                $item['Ecoscore'] += $w['real_answers'][0]['answer']['weight'];
            }

            $fres[$k] = $item;
        }

        return $fres;
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
        return Residence::findOrFail(Hashids::decode($id));
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

        // find the corresponding residence and question
        $residence = Residence::findOrFail(Hashids::decode($request->input('residence')))->first();
        $question = Question::findOrFail($request->input('question'));

        $reply = new Reply();
        $reply->question_id = $question->id;
        $reply->residence_id = $residence->id;

        $lastR = Reply::all()->last();
        $reply->save();

        $question->reply()->associate($reply);

        $residence->replies()->save($reply);

        if ($request->input('answers')) {
            foreach ($request->input('answers') as $answer) {
                // fetch the answer of the reply
                $found = Answer::find($answer['answer']);

                // fill the real_answer
                $real_answer = new RealAnswer();
                $real_answer->unknown = $request->input('unknown');
                $real_answer->answer_id = $found->id;

                if($answer['input']) {
                    $real_answer->input = $answer['input'];
                }

                // persist answer
                $reply->real_answers()->save($real_answer);
            }
        }

        $reply->save();

        return response()->json(array(
            'residence' => $residence
        ));

        /*
         * nextQuestion no longer needed
        $nextQuestion = Question::findOrFail($question->next_question)->load('answers');

        return response()->json(array(
            'residence' => $residence,
            'question' => $nextQuestion
        ));
        */
    }

    public function tips()
    {
        return View('tips');
    }

    public function getAnswers($id) {
        return Residence::findOrFail(Hashids::decode($id))->load('replies.real_answers.answer.question');
    }
}
