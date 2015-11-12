<?php

Route::group(['middleware' => 'cors'], function () {
    Route::resource('api/questions', 'QuestionController', ['only' => ['index', 'show']]);
    Route::resource('api/sections', 'SectionController', ['only' => ['index', 'show']]);
    Route::get('api/residences/{id}', 'ResidenceController@show');
    Route::get('api/residences', 'ResidenceController@getAll');
    Route::post('api/residences', 'ResidenceController@store');
    Route::post('api/residences/reply', 'ResidenceController@reply');
    Route::get('api/residences/answers/{id}', 'ResidenceController@getAnswers');
   // Route::post('api/residences/reply/{id}/', 'ResidenceController@reply');
});

Route::get('', [
    'as'    => 'map',
    'uses'  => 'MapController@index'
]);

Route::post('location', 'MapController@location');
Route::get('/questionnaire', [
	'as' => 'questionnaire',
	'uses' => 'ResidenceController@index'
]);

Route::get('/tips', [
	'as' => 'tips',
	'uses' => 'ResidenceController@tips'
]);
