<?php

Route::group(['middleware' => 'cors'], function () {
    Route::resource('api/questions', 'QuestionController', ['only' => ['index', 'show']]);
    Route::resource('api/sections', 'SectionController', ['only' => ['index', 'show']]);
    Route::resource('api/residences', 'ResidenceController', ['only' => ['store', 'show']]);
    Route::post('api/residences/reply', 'ResidenceController@reply');
});

Route::get('', 'MapController@index');
Route::post('location', 'MapController@location');
Route::get('/questionnaire', [
	'as' => 'questionnaire',
	'uses' => 'ResidenceController@index'
]);