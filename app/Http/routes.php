<?php

Route::resource('api/question', 'QuestionController', ['only' => ['index', 'show']]);
