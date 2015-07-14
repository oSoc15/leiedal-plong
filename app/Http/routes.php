<?php

Route::resource('question', 'QuestionController', ['only' => ['index', 'show']]);