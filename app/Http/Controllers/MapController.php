<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MapController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $lat = 50.8086126;
        $lon = 3.2469894;
        $zoom = 14;
        return View('map', array('lat' => $lat, 'lon' => $lon,'zoom' => $zoom));
    }

    /**
     * find location on map
     * @return type
     */
    public function location(Request $request)
    {
        if ($request->ajax()) {
            $location = $request->input('location');

            // url to match the location entry of the user
            $maps_url = 'http://loc.geopunt.be/geolocation/location?q=' . urlencode($location);

            // get the content and convert to json
            $maps_json = file_get_contents($maps_url);
            $maps_array = json_decode($maps_json, true);

            if (!empty($maps_array['LocationResult'][0]['Location']['Lat_WGS84'])) {
                $lat = $maps_array['LocationResult'][0]['Location']['Lat_WGS84'];
                $lon = $maps_array['LocationResult'][0]['Location']['Lon_WGS84'];
                $zoom = 18;


                $formattedAdress = $maps_array['LocationResult'][0]['FormattedAddress'];
                $keywords = preg_split("/[,]+/", $formattedAdress);
                $length = count($keywords);
                $adres = $keywords[0];

                if (ctype_alpha(substr($adres, -1))) {
                    $adres = substr($adres, 0, strlen($adres) - 1) . '  ' . substr($adres, -1);
                }

                $obid_json = file_get_contents('http://www.govmaps.eu/arcgis/rest/services/ICL/ICL_Energielabelatlas/MapServer/0/query?where=ADRES' . urlencode('=\'' . $adres . '\'') . '&returnIdsOnly=true&f=pjson');
                $obid_array = json_decode($obid_json, true);

                $objectId = $obid_array['objectIds'][0];

                $residence_info_json = file_get_contents("http://www.govmaps.eu/arcgis/rest/services/ICL/ICL_Energielabelatlas/MapServer/2/" . $objectId . "?f=pjson");
                $residence_info_array = json_decode($residence_info_json, true);

                preg_match('/(\d+)(.*)/', $adres, $number);
                $adres = trim(str_replace(range(0,9),'',$adres));

                if (!empty($residence_info_array['feature']['attributes'])) {
                    return response()->json(array(
                        'error' => false,
                        'lat' => $maps_array['LocationResult'][0]['Location']['Lat_WGS84'],
                        'lon' => $maps_array['LocationResult'][0]['Location']['Lon_WGS84'],
                        'zoom' => $zoom,
                        'street' => $adres,
                        'number' => $number[0],
                        'city' => trim($keywords[1]),
                        'residence' => $residence_info_array['feature']
                    ));
                } else {
                    return response()->json(array(
                        'error' => true,
                        'message' => 'The residence could not be found'
                    ));
                }
            } else {
                return response()->json(array(
                    'error' => true,
                    'message' => 'The residence could not be found'
                ));
            }
        }

        return response()->json(array(
            'error' => true,
            'message' => 'An incorrect request has been send'
        ));
    }

}
