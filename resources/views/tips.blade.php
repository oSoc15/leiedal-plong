<!DOCTYPE html>
<html ng-app="app">
<head>
    <title>PLONG - Tips</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/map.css') }}">
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>
</head>
<body ng-controller="TipCtrl">
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="{{ URL::route('map') }}">Plong</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
            <ul class="nav navbar-nav navbar-right">
                <li><a href="{{ URL::route('map') }}">Kaart</a></li>
                <li><a href="{{ URL::route('tips') }}">Tips</a></li>
                <li><a href="#">Help</a></li>
            </ul>
        </div><!--/.navbar-collapse -->
    </div>
</nav>
<div class="container">
    <div id="tips">
        <h1>Resultaat</h1>
        <hr>
        <div ng-show="loading">Laden...</div>
        <div ng-show="error">Er is iets fout gegaan. Gelieve een administrator te contacteren als het probleem zich blijft voortdoen.</div>
        <div ng-show="!loading && !error">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        Overzicht
                    </h3>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">
                    Uw adres: <b><% answers.street + ' ' + answers.number + ', ' + answers.city %></b>.
                    </li><li class="list-group-item">
                    Uw energielabel: <b>Label <% score.label %></b>.
                    </li><li class="list-group-item">
                    Energiescore: <b><% score.totaal %> punten</b> (hoger is beter).</li>
                </ul>
            </div>
            <h2>Gepersonaliseerde Tips</h2>
            <hr>
            <div class="tips-tips">
                <div ng-repeat="r in answers.replies">
                    <div class="panel <% r.real_answers[0].colour %>">
                        <div class="panel-heading">
                            <h3 class="panel-title">
                                <% r.real_answers[0].answer.question.description %>
                            </h3>
                        </div>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <span ng-if="r.real_answers[0].input"><b>Uw antwoord:</b> <% r.real_answers[0].input %> <br></span>
                                <span ng-if="!r.real_answers[0].input"><b>Uw antwoord:</b> <% r.real_answers[0].answer.title %> <br></span>
                                <b>Gewicht:</b> <% r.real_answers[0].answer.weight %>
                            </li>
                        </ul>
                        <div class="panel-body">
                            <b>Tips:</b>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script src="{{ asset('bower_components/angular/angular.min.js') }}"></script>
<script src="{{ asset('bower_components/angular-resource/angular-resource.min.js') }}"></script>
<script src="{{ asset('bower_components/ngstorage/ngStorage.min.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/controllers/tipCtrl.js') }}"></script>

</body>
</html>