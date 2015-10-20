<?php

Route::group(['middleware' => 'cors'], function () {
    Route::resource('api/questions', 'QuestionController', ['only' => ['index', 'show']]);
    Route::resource('api/sections', 'SectionController', ['only' => ['index', 'show']]);
    Route::get('api/residences/{id}', 'ResidenceController@show');
    Route::post('api/residences', 'ResidenceController@store');
    Route::post('api/residences/reply', 'ResidenceController@reply');
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

Route::get('/tips/{id?}', [
	'as' => 'tips',
	'uses' => 'ResidenceController@tips'
]);
