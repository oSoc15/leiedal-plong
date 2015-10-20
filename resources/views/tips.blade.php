<!DOCTYPE html>
<html ng-app="app">>
<head>
    <title>PLONG - Tips</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
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
<div class="container map-wrapper">
    <h1>U hebt de tip pagina bereikt</h1>

</div>


<script src="{{ asset('bower_components/angular/angular.min.js') }}"></script>
<script src="{{ asset('bower_components/angular-resource/angular-resource.min.js') }}"></script>
<script src="{{ asset('bower_components/ngstorage/ngStorage.min.js') }}"></script>
<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/controllers/tipCtrl.js') }}"></script>

</body>
</html>