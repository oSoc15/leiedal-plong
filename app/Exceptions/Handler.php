<?php

namespace app\Exceptions;

use Exception;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        HttpException::class,
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param \Exception $e
     */
    public function report(Exception $e)
    {
        return parent::report($e);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Exception               $e
     *
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            $error_json = new \stdClass();
            $error_json->error = new \stdClass();
            $error_json->error->type = 'invalid_request_error';
            // TODO: add description of which resource is not found
            $error_json->error->message = 'The resource could not be found';
            return response()
                ->json($error_json)
                ->setStatusCode(404)
                ->header('Access-Control-Allow-Origin', '*');
        }

        return parent::render($request, $e);
    }
}
