<!DOCTYPE html>
<html>
<head>
    <title>PLONG</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"> 
    <link rel="stylesheet" href="{{ asset('css/map.css') }}">
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.css" />
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>
    <script src="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.js"></script>
    <script src="{{ asset('js/leafletesri.js') }}"></script> 
    <script src="{{ asset('js/leafletwms.js') }}"></script> 
    
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
                    <li><a href="{{ URL::route('questionnaire') }}">Bereken</a></li>
                    <li><a href="{{ URL::route('tips') }}">Tips</a></li>
                    <li><a href="#">Help</a></li>
                </ul>
                <form class="navbar-form navbar-right">
                    <input type="text" placeholder="Zoek locatie..." class="form-control">
                </form>
            </div><!--/.navbar-collapse -->
        </div>
    </nav>
    <div class="container map-wrapper">
        <div id="map"></div>

        <!-- TODO: Why are these alerts here, where are they called?

        <div class="alert alert-success alert-dismissible notification" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <strong>Goed gedaan!</strong> Bepaal jouw ecolabel door het invullen van een <a href="{{ URL::to('questionnaire') }}" class="alert-link">vragenlijst</a>
        </div>
        <div class="alert alert-danger alert-dismissible notification" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <strong>Oeps!</strong> De ingevulde locatie kan niet gevonden worden
        </div>

        -->

        <!-- Questionnaire prompt modal -->
      <div class="modal fade" id="direct">
        	<div class="modal-dialog">
        		<div class="modal-content">
        			<div class="modal-header">
        				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        				<h4 class="modal-title">Ecolabel</h4>
        			</div>
        			<div class="modal-body">
        				<p>Bepaal jouw ecolabel door het beantwoorden van een reeks van vragen</p>
        			</div>
        			<div class="modal-footer">
        				<button type="button" class="btn btn-default" data-dismiss="modal">Sluit dit venster</button>
        				<a href="{{ URL::to('questionnaire') }}" class="btn btn-primary">Vragenlijst</a>
        			</div>
        		</div><!-- /.modal-content -->
        	</div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

        <!-- Location not found modal -->
        <div class="modal fade" id="notfound">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Foutmelding</h4>
                    </div>
                    <div class="modal-body">
                        <p>Het opgevraagde adres kon niet worden gevonden. <br>
                        Adressen hebben volgend formaat: "straatnaam huisnummer, stad".
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Sluit dit venster</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->

    </div>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript">

        /*

         var crs = new L.Proj.CRS("EPSG:31370",
         "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,4.1,-2.2,1.842183,-1.2747 +units=m +no_defs",
         {
         resolutions: [12000, 143000, 269000, 255000] // 3 example zoom level resolutions
         }
         );

         */

        // Offset 2nd layer to match baselayer
        var crs = new L.Proj.CRS("EPSG:31370",
                "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,4.1,-2.2,1.842183,-1.2747 +units=m +no_defs",
                {
                    resolutions: [12000, 143000, 269000, 255000] // 3 example zoom level resolutions
                }
        );

        // attach the map to the div 
        var map = L.map('map').setView([{{ $lat }}, {{ $lon }}], {{ $zoom }});
        
        // include the basemap with the belgian coordinates
        L.WMS.tileLayer("http://grb.agiv.be/geodiensten/raadpleegdiensten/GRB-basiskaart/wmsgr?", {
            'tileSize': 512,
            'layers': 'GRB_BASISKAART',
            'transparent': false,
            'crs': crs
        }).addTo(map);

        /* L.WMS.tileLayer("http://wms.agiv.be/ogc/wms/omkl?", {
            'tileSize': 512,
            'layers': 'Ortho',
            'transparent': true
        }).addTo(map); */

        // add the map with the ecolabels
        L.esri.dynamicMapLayer({
            url: 'http://www.govmaps.eu/arcgis/rest/services/ICL/ICL_Energielabelatlas/MapServer',
            opacity: 0.3,
            'crs': crs
        }).addTo(map);

        // check for enter in search bar
        $('.navbar-form input').keydown(function(event) {
            if(event.keyCode == 13){
                event.preventDefault();
                if (event.target.value.trim().length != 0) {
                	getLocation(event.target.value);
                } else {
                    console.log("No search parameters");
                }
            }
        });

        function getLocation (given) {

        	// get data of given search 
            $.ajax({ 
            	url: 'location',
            	type: 'post',
            	data: {'location': given}
            }).done(function(data) {
                console.log(data);
            	//check if residence can be found
            	if (!data.error) {
	            	// zoom map to the result
	            	map.setView([data.lat, data.lon], data.zoom, {animation: true});

	            	// create residence object
	            	var residence = {
	            		'lat': data.lat,
	            		'lon': data.lon,
	            		'street': data.street,
	            		'number': data.number,
	            		'city': data.city
	            	};

	            	// store residence object to localstorage so angular can use it
	            	localStorage.setItem('residence', JSON.stringify(residence));

	            	// open modal to go to the questionnaire
	            	$('#direct').modal({
	            		show: true
	            	});
            	} else {
                    $('#notfound').modal({
                        show: true
                    });
            	}
            }).fail(function(error, data) {
            	console.log(error);
            });
        }
    </script>
</body>
</html>