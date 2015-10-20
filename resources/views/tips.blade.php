<!DOCTYPE html>
<html>
<head>
    <title>PLONG - Tips</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>

    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/2.0.0/proj4.js"></script>
    <script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="{{ asset('js/proj.js') }}"></script>
</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Plong</a>
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
    <p>{{ $id }}</p>
</div>
</body>
</html>