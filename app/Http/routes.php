<?php

Route::resource('api/questions', 'QuestionController', ['only' => ['index', 'show']]);
Route::resource('api/sections', 'SectionController', ['only' => ['index', 'show']]);
Route::resource('api/residences', 'ResidenceController', ['only' => ['store', 'show']]);
Route::post('api/residences/reply', 'ResidenceController@reply');
