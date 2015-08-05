<!DOCTYPE html>
<html>
<head>
    <title>PLONG</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"> 
    <link rel="stylesheet" href="css/map.css" />
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.css" />
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css'>
    <script src="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.js"></script>
    <script src="js/leafletesri.js"></script>
    <script src="js/leafletwms.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/proj4js/2.0.0/proj4.js"></script>
    <script src="js/proj.js"></script>
</head>
<body>
    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container">
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
                    <li><a href="#">Bereken</a></li>
                    <li><a href="#">Tips</a></li>
                    <li><a href="#">Help</a></li>
                </ul>
                <form class="navbar-form navbar-right">
                    <input type="text" placeholder="Zoek..." class="form-control">
                </form>
            </div><!--/.navbar-collapse -->
        </div>
    </nav>
    <div class="container map-wrapper">
        <div id="map"></div>
    </div>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script type="text/javascript">
    
        $(function() {
            var crs = new L.Proj.CRS("EPSG:31370",
                "+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.868628,52.297783,-103.723893,0.336570,-0.456955,1.842183,-1.2747 +units=m +no_defs",
                {
                    resolutions: [12000, 143000, 269000, 255000], // 3 example zoom level resolutions
                }
            );
            // var map = L.map('map').setView([<?php echo $lat; ?>, <?php echo $lon; ?>], <?php echo $zoom; ?>);
            var tiles = L.WMS.tileLayer("http://grb.agiv.be/geodiensten/raadpleegdiensten/GRB-basiskaart/wmsgr?", {
                'tileSize': 512,
                'layers': 'GRB_BASISKAART',
                'transparent': false,
                'crs': crs
            });
            tiles.addTo(map);
            var tiles2 = L.WMS.tileLayer("http://wms.agiv.be/ogc/wms/omkl?", {
                'tileSize': 512,
                'layers': 'Ortho',
                'transparent': true
            });
            tiles2.addTo(map);
            L.esri.dynamicMapLayer({
                url: 'http://www.govmaps.eu/arcgis/rest/services/ICL/ICL_Energielabelatlas/MapServer',
                opacity: 0.5,
                'crs': crs
            }).addTo(map);
            $('.navbar-form input').keydown(function(event) {
                if(event.keyCode == 13){
                    event.preventDefault();
                    getLocation(event.target.value);
                }
            });
        });

        // function getLocation (given) {
        //     console.log('test');  
        //     $.get('http://loc.geopunt.be/geolocation/location?q=' + given) 
        // }
    </script>
</body>
</html>