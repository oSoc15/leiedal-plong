<!doctype html>
<html ng-app="app">

	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title ng-bind="pageTitle">Vragenlijst</title>
		<meta name="description" content="Plong app">
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<meta name="apple-mobile-web-app-c0.apable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="stylesheet" href="{{ asset('css/screen.css') }}">
		<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>
	</head>

	<body ng-controller="MainCtrl">
		<div id="questionairepage">
		    <div class="illustrationbox">
                <img src="assets/platform.svg" />
                <div prefixes="prefixes" building>
		            <img src="assets/images/main_home.svg" />
                </div>
		        <div class="label-leiedal"></div>
		    </div>

		    <!-- animation/illustration -->
		    <div id="questionsubpage">

		        <!-- energylabel -->
		        <!--<div class="label">
		            Uw huidig label
		            <div class="label___letter" ng-bind="label()"></div>
		        </div>-->

		        <!-- progressbar -->
		        <div class="progressbar">
		            <div class="progress" style="width:<%100*q/(questions.length-1)|number:2%>%" class="progress" >
		            </div>
		        </div>

		        <!-- questions -->
		        <div class="question" ng-class="{'question--done':answers[questions[q].key]}">
		            <!-- menu -->
		            <ul class="flex-container">
		                <!-- navigate previous question -->
		                <li id="previous" ng-click="q==0 || toPreviousQuestion()" ng-disabled="q==0" ng-style="{opacity : ((q==0) && '0.3') || '1'}" class="flex-item icon-left"></li>
		                <!-- all questions -->
		                <li id="overview" ng-click="" ng-disabled="q==0" class="flex-item icon-overview"></li>
		                <!-- shows questions -->
		                <li id="question"class="flex-item grow">
                            <p ng-bind="questions[q].description" ng-show="!questComplete"></p>
                            <p ng-show="questComplete">Bereken uw score</p>
                        </li>
		                <!-- shows information about the question -->
		                <li id="info" ng-click="" ng-disabled="" class="flex-item icon-info"></li>
		                <!-- navigate next question -->
		                <li id="next" ng-disabled="q>=questions.length" ng-click="answer()" ng-style="{opacity : ((q>=questions.length || questComplete) && '0.3') || '1'}" class="flex-item icon-right"></li>
                    </ul>
		        </div>

		        <div class="answers">
		            <div ng-show="!questComplete" ng-repeat="(a, ans) in questions[q].answers" ng-click="select(questions[q], ans)" ng-class="{'answer-button':answers[questions[q].key]==ans.value, 'answer-selected': sessionReplies[q]==<%$index%>}">
		                <img ng-src="<%getImageUrl($index)%>" alt="<%ans.image%>" class="answer-image answer-image-<%$index%>" >
		                <span ng-bind="ans.title" class=""></span>
	<!--	                <input ng-if="ans.type=='year'" type="range" ng-model="ans.value" min="1900" max="2000">
		                <span ng-if="ans.type=='year'"><%ans.value%></span> -->
		            </div>

                    <div ng-show="questComplete" ng-click="finish('{{ URL::route('tips') }}')" ng-class="'answer-button'">
                        <span class="">Bereken!</span>
                    </div>

                <!-- TODO: Check if this can be removed
                    <nav class="mobile">
                        <div id="menu" class="" ui-view="menu"></div>
                    </nav>

                    <div id="slider" class="slider-menu"></div>
                    <div id="items" class="menu-items"></div>

                    <div id="shadow" class="info-shadow"></div>
                    <div class="info"></div>
                    -->
		        <!-- Categorie -->
		        <!--<div id="qcategoriesubpage">
		            <p>qcategoriesubpage</p>

		            <div id=""></div>
		        </div>-->
		        </div>
		    </div>
        </div>

        <script src="{{ asset('bower_components/angular/angular.min.js') }}"></script>
        <script src="{{ asset('bower_components/angular-resource/angular-resource.min.js') }}"></script>
        <script src="{{ asset('bower_components/ngstorage/ngStorage.min.js') }}"></script>
        <script src="{{ asset('js/app.js') }}"></script>
        <script src="{{ asset('js/controllers/mainCtrl.js') }}"></script>
	</body>
</html>