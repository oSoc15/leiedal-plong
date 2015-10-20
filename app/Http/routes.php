<?php

Route::group(['middleware' => 'cors'], function () {
    Route::resource('api/questions', 'QuestionController', ['only' => ['index', 'show']]);
    Route::resource('api/sections', 'SectionController', ['only' => ['index', 'show']]);
    Route::get('api/residences/{id}', 'ResidenceController@show');
    Route::post('api/residences', 'ResidenceController@store');
    Route::post('api/residences/reply', 'ResidenceController@reply');
});

Route::get('', 'MapController@index');
Route::post('location', 'MapController@location');
Route::get('/questionnaire', [
	'as' => 'questionnaire',
	'uses' => 'ResidenceController@index'
]);

Route::get('/tips', [
	'as' => 'tips',
	'uses' => 'ResidenceController@tips'
]);
