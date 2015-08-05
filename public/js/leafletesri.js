/* esri-leaflet - v2.0.0-beta.4 - Fri Jul 24 2015 10:41:40 GMT-0700 (PDT)
 * Copyright (c) 2015 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("leaflet")) : typeof define === "function" && define.amd ? define(["exports", "leaflet"], factory) : factory(global.L.esri = {}, L)
})(this, function (exports, L) {
    "use strict";
    var cors = window.XMLHttpRequest && "withCredentials"in new window.XMLHttpRequest;
    var pointerEvents = document.documentElement.style.pointerEvents === "";
    exports.Support = {cors: cors, pointerEvents: pointerEvents};
    function pointsEqual(a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false
            }
        }
        return true
    }
    function closeRing(coordinates) {
        if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
            coordinates.push(coordinates[0])
        }
        return coordinates
    }
    function ringIsClockwise(ringToTest) {
        var total = 0;
        var i = 0;
        var rLength = ringToTest.length;
        var pt1 = ringToTest[i];
        var pt2;
        for (i; i < rLength - 1; i++) {
            pt2 = ringToTest[i + 1];
            total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
            pt1 = pt2
        }
        return total >= 0
    }
    function vertexIntersectsVertex(a1, a2, b1, b2) {
        var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
        var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
        var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);
        if (uB !== 0) {
            var ua = uaT / uB;
            var ub = ubT / uB;
            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                return true
            }
        }
        return false
    }
    function arrayIntersectsArray(a, b) {
        for (var i = 0; i < a.length - 1; i++) {
            for (var j = 0; j < b.length - 1; j++) {
                if (vertexIntersectsVertex(a[i], a[i + 1], b[j], b[j + 1])) {
                    return true
                }
            }
        }
        return false
    }
    function coordinatesContainPoint(coordinates, point) {
        var contains = false;
        for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
            if ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1] || coordinates[j][1] <= point[1] && point[1] < coordinates[i][1]) && point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0]) {
                contains = !contains
            }
        }
        return contains
    }
    function coordinatesContainCoordinates(outer, inner) {
        var intersects = arrayIntersectsArray(outer, inner);
        var contains = coordinatesContainPoint(outer, inner[0]);
        if (!intersects && contains) {
            return true
        }
        return false
    }
    function convertRingsToGeoJSON(rings) {
        var outerRings = [];
        var holes = [];
        var x;
        var outerRing;
        var hole;
        for (var r = 0; r < rings.length; r++) {
            var ring = closeRing(rings[r].slice(0));
            if (ring.length < 4) {
                continue
            }
            if (ringIsClockwise(ring)) {
                var polygon = [ring];
                outerRings.push(polygon)
            } else {
                holes.push(ring)
            }
        }
        var uncontainedHoles = [];
        while (holes.length) {
            hole = holes.pop();
            var contained = false;
            for (x = outerRings.length - 1; x >= 0; x--) {
                outerRing = outerRings[x][0];
                if (coordinatesContainCoordinates(outerRing, hole)) {
                    outerRings[x].push(hole);
                    contained = true;
                    break
                }
            }
            if (!contained) {
                uncontainedHoles.push(hole)
            }
        }
        while (uncontainedHoles.length) {
            hole = uncontainedHoles.pop();
            var intersects = false;
            for (x = outerRings.length - 1; x >= 0; x--) {
                outerRing = outerRings[x][0];
                if (arrayIntersectsArray(outerRing, hole)) {
                    outerRings[x].push(hole);
                    intersects = true;
                    break
                }
            }
            if (!intersects) {
                outerRings.push([hole.reverse()])
            }
        }
        if (outerRings.length === 1) {
            return{type: "Polygon", coordinates: outerRings[0]}
        } else {
            return{type: "MultiPolygon", coordinates: outerRings}
        }
    }
    function orientRings(poly) {
        var output = [];
        var polygon = poly.slice(0);
        var outerRing = closeRing(polygon.shift().slice(0));
        if (outerRing.length >= 4) {
            if (!ringIsClockwise(outerRing)) {
                outerRing.reverse()
            }
            output.push(outerRing);
            for (var i = 0; i < polygon.length; i++) {
                var hole = closeRing(polygon[i].slice(0));
                if (hole.length >= 4) {
                    if (ringIsClockwise(hole)) {
                        hole.reverse()
                    }
                    output.push(hole)
                }
            }
        }
        return output
    }
    function flattenMultiPolygonRings(rings) {
        var output = [];
        for (var i = 0; i < rings.length; i++) {
            var polygon = orientRings(rings[i]);
            for (var x = polygon.length - 1; x >= 0; x--) {
                var ring = polygon[x].slice(0);
                output.push(ring)
            }
        }
        return output
    }
    function shallowClone(obj) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i]
            }
        }
        return target
    }
    function extentToBounds(extent) {
        var sw = L.latLng(extent.ymin, extent.xmin);
        var ne = L.latLng(extent.ymax, extent.xmax);
        return L.latLngBounds(sw, ne)
    }
    function boundsToExtent(bounds) {
        bounds = L.latLngBounds(bounds);
        return{xmin: bounds.getSouthWest().lng, ymin: bounds.getSouthWest().lat, xmax: bounds.getNorthEast().lng, ymax: bounds.getNorthEast().lat, spatialReference: {wkid: 4326}}
    }
    function arcgisToGeojson(arcgis, idAttribute) {
        var geojson = {};
        if (typeof arcgis.x === "number" && typeof arcgis.y === "number") {
            geojson.type = "Point";
            geojson.coordinates = [arcgis.x, arcgis.y]
        }
        if (arcgis.points) {
            geojson.type = "MultiPoint";
            geojson.coordinates = arcgis.points.slice(0)
        }
        if (arcgis.paths) {
            if (arcgis.paths.length === 1) {
                geojson.type = "LineString";
                geojson.coordinates = arcgis.paths[0].slice(0)
            } else {
                geojson.type = "MultiLineString";
                geojson.coordinates = arcgis.paths.slice(0)
            }
        }
        if (arcgis.rings) {
            geojson = convertRingsToGeoJSON(arcgis.rings.slice(0))
        }
        if (arcgis.geometry || arcgis.attributes) {
            geojson.type = "Feature";
            geojson.geometry = arcgis.geometry ? arcgisToGeojson(arcgis.geometry) : null;
            geojson.properties = arcgis.attributes ? shallowClone(arcgis.attributes) : null;
            if (arcgis.attributes) {
                geojson.id = arcgis.attributes[idAttribute] || arcgis.attributes.OBJECTID || arcgis.attributes.FID
            }
        }
        return geojson
    }
    function geojsonToArcGIS(geojson, idAttribute) {
        idAttribute = idAttribute || "OBJECTID";
        var spatialReference = {wkid: 4326};
        var result = {};
        var i;
        switch (geojson.type) {
            case"Point":
                result.x = geojson.coordinates[0];
                result.y = geojson.coordinates[1];
                result.spatialReference = spatialReference;
                break;
            case"MultiPoint":
                result.points = geojson.coordinates.slice(0);
                result.spatialReference = spatialReference;
                break;
            case"LineString":
                result.paths = [geojson.coordinates.slice(0)];
                result.spatialReference = spatialReference;
                break;
            case"MultiLineString":
                result.paths = geojson.coordinates.slice(0);
                result.spatialReference = spatialReference;
                break;
            case"Polygon":
                result.rings = orientRings(geojson.coordinates.slice(0));
                result.spatialReference = spatialReference;
                break;
            case"MultiPolygon":
                result.rings = flattenMultiPolygonRings(geojson.coordinates.slice(0));
                result.spatialReference = spatialReference;
                break;
            case"Feature":
                if (geojson.geometry) {
                    result.geometry = geojsonToArcGIS(geojson.geometry, idAttribute)
                }
                result.attributes = geojson.properties ? shallowClone(geojson.properties) : {};
                if (geojson.id) {
                    result.attributes[idAttribute] = geojson.id
                }
                break;
            case"FeatureCollection":
                result = [];
                for (i = 0; i < geojson.features.length; i++) {
                    result.push(geojsonToArcGIS(geojson.features[i], idAttribute))
                }
                break;
            case"GeometryCollection":
                result = [];
                for (i = 0; i < geojson.geometries.length; i++) {
                    result.push(geojsonToArcGIS(geojson.geometries[i], idAttribute))
                }
                break
        }
        return result
    }
    function responseToFeatureCollection(response, idAttribute) {
        var objectIdField;
        if (idAttribute) {
            objectIdField = idAttribute
        } else if (response.objectIdFieldName) {
            objectIdField = response.objectIdFieldName
        } else if (response.fields) {
            for (var j = 0; j <= response.fields.length - 1; j++) {
                if (response.fields[j].type === "esriFieldTypeOID") {
                    objectIdField = response.fields[j].name;
                    break
                }
            }
        } else {
            objectIdField = "OBJECTID"
        }
        var featureCollection = {type: "FeatureCollection", features: []};
        var features = response.features || response.results;
        if (features.length) {
            for (var i = features.length - 1; i >= 0; i--) {
                featureCollection.features.push(arcgisToGeojson(features[i], objectIdField))
            }
        }
        return featureCollection
    }
    function cleanUrl(url) {
        url = L.Util.trim(url);
        if (url[url.length - 1] !== "/") {
            url += "/"
        }
        return url
    }
    function isArcgisOnline(url) {
        return/\.arcgis\.com.*?FeatureServer/g.test(url)
    }
    function geojsonTypeToArcGIS(geoJsonType) {
        var arcgisGeometryType;
        switch (geoJsonType) {
            case"Point":
                arcgisGeometryType = "esriGeometryPoint";
                break;
            case"MultiPoint":
                arcgisGeometryType = "esriGeometryMultipoint";
                break;
            case"LineString":
                arcgisGeometryType = "esriGeometryPolyline";
                break;
            case"MultiLineString":
                arcgisGeometryType = "esriGeometryPolyline";
                break;
            case"Polygon":
                arcgisGeometryType = "esriGeometryPolygon";
                break;
            case"MultiPolygon":
                arcgisGeometryType = "esriGeometryPolygon";
                break
        }
        return arcgisGeometryType
    }
    function warn() {
        if (console && console.warn) {
            console.warn.apply(console, arguments)
        }
    }
    exports.Util = {shallowClone: shallowClone, warn: warn, cleanUrl: cleanUrl, isArcgisOnline: isArcgisOnline, geojsonTypeToArcGIS: geojsonTypeToArcGIS, responseToFeatureCollection: responseToFeatureCollection, geojsonToArcGIS: geojsonToArcGIS, arcgisToGeojson: arcgisToGeojson, boundsToExtent: boundsToExtent, extentToBounds: extentToBounds};
    var callbacks = 0;
    function serialize(params) {
        var data = "";
        params.f = params.f || "json";
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var param = params[key];
                var type = Object.prototype.toString.call(param);
                var value;
                if (data.length) {
                    data += "&"
                }
                if (type === "[object Array]") {
                    value = Object.prototype.toString.call(param[0]) === "[object Object]" ? JSON.stringify(param) : param.join(",")
                } else if (type === "[object Object]") {
                    value = JSON.stringify(param)
                } else if (type === "[object Date]") {
                    value = param.valueOf()
                } else {
                    value = param
                }
                data += encodeURIComponent(key) + "=" + encodeURIComponent(value)
            }
        }
        return data
    }
    function createRequest(callback, context) {
        var httpRequest = new window.XMLHttpRequest;
        httpRequest.onerror = function (e) {
            httpRequest.onreadystatechange = L.Util.falseFn;
            callback.call(context, {error: {code: 500, message: "XMLHttpRequest error"}}, null)
        };
        httpRequest.onreadystatechange = function () {
            var response;
            var error;
            if (httpRequest.readyState === 4) {
                try {
                    response = JSON.parse(httpRequest.responseText)
                } catch (e) {
                    response = null;
                    error = {code: 500, message: "Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error."}
                }
                if (!error && response.error) {
                    error = response.error;
                    response = null
                }
                httpRequest.onerror = L.Util.falseFn;
                callback.call(context, error, response)
            }
        };
        return httpRequest
    }
    function xmlHttpPost(url, params, callback, context) {
        var httpRequest = createRequest(callback, context);
        httpRequest.open("POST", url);
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.send(serialize(params));
        return httpRequest
    }
    function xmlHttpGet(url, params, callback, context) {
        var httpRequest = createRequest(callback, context);
        httpRequest.open("GET", url + "?" + serialize(params), true);
        httpRequest.send(null);
        return httpRequest
    }
    function request(url, params, callback, context) {
        var paramString = serialize(params);
        var httpRequest = createRequest(callback, context);
        var requestLength = (url + "?" + paramString).length;
        if (requestLength <= 2e3 && exports.Support.cors) {
            httpRequest.open("GET", url + "?" + paramString);
            httpRequest.send(null)
        } else if (requestLength > 2e3 && exports.Support.cors) {
            httpRequest.open("POST", url);
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send(paramString)
        } else if (requestLength <= 2e3 && !exports.Support.cors) {
            return jsonp(url, params, callback, context)
        } else {
            warn("a request to " + url + " was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html");
            return
        }
        return httpRequest
    }
    function jsonp(url, params, callback, context) {
        window._EsriLeafletCallbacks = window._EsriLeafletCallbacks || {};
        var callbackId = "c" + callbacks;
        params.callback = "window._EsriLeafletCallbacks." + callbackId;
        var script = L.DomUtil.create("script", null, document.body);
        script.type = "text/javascript";
        script.src = url + "?" + serialize(params);
        script.id = callbackId;
        window._EsriLeafletCallbacks[callbackId] = function (response) {
            if (window._EsriLeafletCallbacks[callbackId] !== true) {
                var error;
                var responseType = Object.prototype.toString.call(response);
                if (!(responseType === "[object Object]" || responseType === "[object Array]")) {
                    error = {error: {code: 500, message: "Expected array or object as JSONP response"}};
                    response = null
                }
                if (!error && response.error) {
                    error = response;
                    response = null
                }
                callback.call(context, error, response);
                window._EsriLeafletCallbacks[callbackId] = true
            }
        };
        callbacks++;
        return{id: callbackId, url: script.src, abort: function () {
                window._EsriLeafletCallbacks._callback[callbackId]({code: 0, message: "Request aborted."})
            }}
    }
    exports.get = exports.Support.cors ? xmlHttpGet : jsonp;
    exports.get.CORS = xmlHttpGet;
    exports.get.JSONP = jsonp;
    var Request = {request: request, get: exports.get, post: xmlHttpPost};
    exports.Task = L.Class.extend({options: {proxy: false, useCors: cors}, generateSetter: function (param, context) {
            return L.Util.bind(function (value) {
                this.params[param] = value;
                return this
            }, context)
        }, initialize: function (endpoint) {
            if (endpoint.request && endpoint.options) {
                this._service = endpoint;
                L.Util.setOptions(this, endpoint.options)
            } else {
                L.Util.setOptions(this, endpoint);
                this.options.url = cleanUrl(endpoint.url)
            }
            this.params = L.Util.extend({}, this.params || {});
            if (this.setters) {
                for (var setter in this.setters) {
                    var param = this.setters[setter];
                    this[setter] = this.generateSetter(param, this)
                }
            }
        }, token: function (token) {
            if (this._service) {
                this._service.authenticate(token)
            } else {
                this.params.token = token
            }
            return this
        }, request: function (callback, context) {
            if (this._service) {
                return this._service.request(this.path, this.params, callback, context)
            }
            return this._request("request", this.path, this.params, callback, context)
        }, _request: function (method, path, params, callback, context) {
            var url = this.options.proxy ? this.options.proxy + "?" + this.options.url + path : this.options.url + path;
            if ((method === "get" || method === "request") && !this.options.useCors) {
                return Request.get.JSONP(url, params, callback, context)
            }
            return Request[method](url, params, callback, context)
        }});
    function task(options) {
        return new exports.Task(options)
    }
    exports.Query = exports.Task.extend({setters: {offset: "offset", limit: "limit", fields: "outFields", precision: "geometryPrecision", featureIds: "objectIds", returnGeometry: "returnGeometry", token: "token"}, path: "query", params: {returnGeometry: true, where: "1=1", outSr: 4326, outFields: "*"}, within: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelContains";
            return this
        }, intersects: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelIntersects";
            return this
        }, contains: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelWithin";
            return this
        }, crosses: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelCrosses";
            return this
        }, touches: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelTouches";
            return this
        }, overlaps: function (geometry) {
            this._setGeometry(geometry);
            this.params.spatialRel = "esriSpatialRelOverlaps";
            return this
        }, nearby: function (latlng, radius) {
            latlng = L.latLng(latlng);
            this.params.geometry = [latlng.lng, latlng.lat];
            this.params.geometryType = "esriGeometryPoint";
            this.params.spatialRel = "esriSpatialRelIntersects";
            this.params.units = "esriSRUnit_Meter";
            this.params.distance = radius;
            this.params.inSr = 4326;
            return this
        }, where: function (string) {
            this.params.where = string;
            return this
        }, between: function (start, end) {
            this.params.time = [start.valueOf(), end.valueOf()];
            return this
        }, simplify: function (map, factor) {
            var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
            this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
            return this
        }, orderBy: function (fieldName, order) {
            order = order || "ASC";
            this.params.orderByFields = this.params.orderByFields ? this.params.orderByFields + "," : "";
            this.params.orderByFields += [fieldName, order].join(" ");
            return this
        }, run: function (callback, context) {
            this._cleanParams();
            if (exports.Util.isArcgisOnline(this.options.url)) {
                this.params.f = "geojson";
                return this.request(function (error, response) {
                    this._trapSQLerrors(error);
                    callback.call(context, error, response, response)
                }, this)
            } else {
                return this.request(function (error, response) {
                    this._trapSQLerrors(error);
                    callback.call(context, error, response && exports.Util.responseToFeatureCollection(response), response)
                }, this)
            }
        }, count: function (callback, context) {
            this._cleanParams();
            this.params.returnCountOnly = true;
            return this.request(function (error, response) {
                callback.call(this, error, response && response.count, response)
            }, context)
        }, ids: function (callback, context) {
            this._cleanParams();
            this.params.returnIdsOnly = true;
            return this.request(function (error, response) {
                callback.call(this, error, response && response.objectIds, response)
            }, context)
        }, bounds: function (callback, context) {
            this._cleanParams();
            this.params.returnExtentOnly = true;
            return this.request(function (error, response) {
                callback.call(context, error, response && response.extent && exports.Util.extentToBounds(response.extent), response)
            }, context)
        }, pixelSize: function (point) {
            point = L.point(point);
            this.params.pixelSize = [point.x, point.y];
            return this
        }, layer: function (layer) {
            this.path = layer + "/query";
            return this
        }, _trapSQLerrors: function (error) {
            if (error) {
                if (error.code === "400") {
                    exports.Util.warn("one common syntax error in query requests is encasing string values in double quotes instead of single quotes")
                }
            }
        }, _cleanParams: function () {
            delete this.params.returnIdsOnly;
            delete this.params.returnExtentOnly;
            delete this.params.returnCountOnly
        }, _setGeometry: function (geometry) {
            this.params.inSr = 4326;
            if (geometry instanceof L.LatLngBounds) {
                this.params.geometry = exports.Util.boundsToExtent(geometry);
                this.params.geometryType = "esriGeometryEnvelope";
                return
            }
            if (geometry.getLatLng) {
                geometry = geometry.getLatLng()
            }
            if (geometry instanceof L.LatLng) {
                geometry = {type: "Point", coordinates: [geometry.lng, geometry.lat]}
            }
            if (geometry instanceof L.GeoJSON) {
                geometry = geometry.getLayers()[0].feature.geometry;
                this.params.geometry = exports.Util.geojsonToArcGIS(geometry);
                this.params.geometryType = exports.Util.geojsonTypeToArcGIS(geometry.type)
            }
            if (geometry.toGeoJSON) {
                geometry = geometry.toGeoJSON()
            }
            if (geometry.type === "Feature") {
                geometry = geometry.geometry
            }
            if (geometry.type === "Point" || geometry.type === "LineString" || geometry.type === "Polygon") {
                this.params.geometry = exports.Util.geojsonToArcGIS(geometry);
                this.params.geometryType = exports.Util.geojsonTypeToArcGIS(geometry.type);
                return
            }
            exports.Util.warn("invalid geometry passed to spatial query. Should be an L.LatLng, L.LatLngBounds or L.Marker or a GeoJSON Point Line or Polygon object");
            return
        }});
    function query(options) {
        return new exports.Query(options)
    }
    exports.Find = exports.Task.extend({setters: {contains: "contains", text: "searchText", fields: "searchFields", spatialReference: "sr", sr: "sr", layers: "layers", returnGeometry: "returnGeometry", maxAllowableOffset: "maxAllowableOffset", precision: "geometryPrecision", dynamicLayers: "dynamicLayers", returnZ: "returnZ", returnM: "returnM", gdbVersion: "gdbVersion", token: "token"}, path: "find", params: {sr: 4326, contains: true, returnGeometry: true, returnZ: true, returnM: false}, layerDefs: function (id, where) {
            this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ";" : "";
            this.params.layerDefs += [id, where].join(":");
            return this
        }, simplify: function (map, factor) {
            var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
            this.params.maxAllowableOffset = mapWidth / map.getSize().y * factor;
            return this
        }, run: function (callback, context) {
            return this.request(function (error, response) {
                callback.call(context, error, response && exports.Util.responseToFeatureCollection(response), response)
            }, context)
        }});
    function find(options) {
        return new exports.Find(options)
    }
    exports.Identify = exports.Task.extend({path: "identify", between: function (start, end) {
            this.params.time = [start.valueOf(), end.valueOf()];
            return this
        }});
    function identify(options) {
        return new exports.Identify(options)
    }
    exports.IdentifyFeatures = exports.Identify.extend({setters: {layers: "layers", precision: "geometryPrecision", tolerance: "tolerance", returnGeometry: "returnGeometry"}, params: {sr: 4326, layers: "all", tolerance: 3, returnGeometry: true}, on: function (map) {
            var extent = exports.Util.boundsToExtent(map.getBounds());
            var size = map.getSize();
            this.params.imageDisplay = [size.x, size.y, 96];
            this.params.mapExtent = [extent.xmin, extent.ymin, extent.xmax, extent.ymax];
            return this
        }, at: function (latlng) {
            latlng = L.latLng(latlng);
            this.params.geometry = [latlng.lng, latlng.lat];
            this.params.geometryType = "esriGeometryPoint";
            return this
        }, layerDef: function (id, where) {
            this.params.layerDefs = this.params.layerDefs ? this.params.layerDefs + ";" : "";
            this.params.layerDefs += [id, where].join(":");
            return this
        }, simplify: function (map, factor) {
            var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
            this.params.maxAllowableOffset = mapWidth / map.getSize().y * (1 - factor);
            return this
        }, run: function (callback, context) {
            return this.request(function (error, response) {
                if (error) {
                    callback.call(context, error, undefined, response);
                    return
                } else {
                    var featureCollection = exports.Util.responseToFeatureCollection(response);
                    response.results = response.results.reverse();
                    for (var i = 0; i < featureCollection.features.length; i++) {
                        var feature = featureCollection.features[i];
                        feature.layerId = response.results[i].layerId
                    }
                    callback.call(context, undefined, featureCollection, response)
                }
            })
        }});
    function identifyFeatures(options) {
        return new exports.IdentifyFeatures(options)
    }
    exports.IdentifyImage = exports.Identify.extend({setters: {setMosaicRule: "mosaicRule", setRenderingRule: "renderingRule", setPixelSize: "pixelSize", returnCatalogItems: "returnCatalogItems", returnGeometry: "returnGeometry"}, params: {returnGeometry: false}, at: function (latlng) {
            latlng = L.latLng(latlng);
            this.params.geometry = JSON.stringify({x: latlng.lng, y: latlng.lat, spatialReference: {wkid: 4326}});
            this.params.geometryType = "esriGeometryPoint";
            return this
        }, getMosaicRule: function () {
            return this.params.mosaicRule
        }, getRenderingRule: function () {
            return this.params.renderingRule
        }, getPixelSize: function () {
            return this.params.pixelSize
        }, run: function (callback, context) {
            return this.request(function (error, response) {
                callback.call(context, error, response && this._responseToGeoJSON(response), response)
            }, this)
        }, _responseToGeoJSON: function (response) {
            var location = response.location;
            var catalogItems = response.catalogItems;
            var catalogItemVisibilities = response.catalogItemVisibilities;
            var geoJSON = {pixel: {type: "Feature", geometry: {type: "Point", coordinates: [location.x, location.y]}, crs: {type: "EPSG", properties: {code: location.spatialReference.wkid}}, properties: {OBJECTID: response.objectId, name: response.name, value: response.value}, id: response.objectId}};
            if (response.properties && response.properties.Values) {
                geoJSON.pixel.properties.values = response.properties.Values
            }
            if (catalogItems && catalogItems.features) {
                geoJSON.catalogItems = exports.Util.responseToFeatureCollection(catalogItems);
                if (catalogItemVisibilities && catalogItemVisibilities.length === geoJSON.catalogItems.features.length) {
                    for (var i = catalogItemVisibilities.length - 1; i >= 0; i--) {
                        geoJSON.catalogItems.features[i].properties.catalogItemVisibility = catalogItemVisibilities[i]
                    }
                }
            }
            return geoJSON
        }});
    function identifyImage(params) {
        return new exports.IdentifyImage(params)
    }
    exports.Service = L.Evented.extend({options: {proxy: false, useCors: cors}, initialize: function (options) {
            options = options || {};
            this._requestQueue = [];
            this._authenticating = false;
            L.Util.setOptions(this, options);
            this.options.url = cleanUrl(this.options.url)
        }, get: function (path, params, callback, context) {
            return this._request("get", path, params, callback, context)
        }, post: function (path, params, callback, context) {
            return this._request("post", path, params, callback, context)
        }, request: function (path, params, callback, context) {
            return this._request("request", path, params, callback, context)
        }, metadata: function (callback, context) {
            return this._request("get", "", {}, callback, context)
        }, authenticate: function (token) {
            this._authenticating = false;
            this.options.token = token;
            this._runQueue();
            return this
        }, _request: function (method, path, params, callback, context) {
            this.fire("requeststart", {url: this.options.url + path, params: params, method: method}, true);
            var wrappedCallback = this._createServiceCallback(method, path, params, callback, context);
            if (this.options.token) {
                params.token = this.options.token
            }
            if (this._authenticating) {
                this._requestQueue.push([method, path, params, callback, context]);
                return
            } else {
                var url = this.options.proxy ? this.options.proxy + "?" + this.options.url + path : this.options.url + path;
                if ((method === "get" || method === "request") && !this.options.useCors) {
                    return Request.get.JSONP(url, params, wrappedCallback)
                } else {
                    return Request[method](url, params, wrappedCallback)
                }
            }
        }, _createServiceCallback: function (method, path, params, callback, context) {
            return L.Util.bind(function (error, response) {
                if (error && (error.code === 499 || error.code === 498)) {
                    this._authenticating = true;
                    this._requestQueue.push([method, path, params, callback, context]);
                    this.fire("authenticationrequired", {authenticate: L.Util.bind(this.authenticate, this)}, true);
                    error.authenticate = L.Util.bind(this.authenticate, this)
                }
                callback.call(context, error, response);
                if (error) {
                    this.fire("requesterror", {url: this.options.url + path, params: params, message: error.message, code: error.code, method: method}, true)
                } else {
                    this.fire("requestsuccess", {url: this.options.url + path, params: params, response: response, method: method}, true)
                }
                this.fire("requestend", {url: this.options.url + path, params: params, method: method}, true)
            }, this)
        }, _runQueue: function () {
            for (var i = this._requestQueue.length - 1; i >= 0; i--) {
                var request = this._requestQueue[i];
                var method = request.shift();
                this[method].apply(this, request)
            }
            this._requestQueue = []
        }});
    function service(options) {
        return new exports.Service(options)
    }
    exports.MapService = exports.Service.extend({identify: function () {
            return identifyFeatures(this)
        }, find: function () {
            return find(this)
        }, query: function () {
            return query(this)
        }});
    function mapService(options) {
        return new exports.MapService(options)
    }
    exports.ImageService = exports.Service.extend({query: function () {
            return query(this)
        }, identify: function () {
            return identifyImage(this)
        }});
    function imageService(options) {
        return new exports.ImageService(options)
    }
    exports.FeatureLayerService = exports.Service.extend({options: {idAttribute: "OBJECTID"}, query: function () {
            return query(this)
        }, addFeature: function (feature, callback, context) {
            delete feature.id;
            feature = geojsonToArcGIS(feature);
            return this.post("addFeatures", {features: [feature]}, function (error, response) {
                var result = response && response.addResults ? response.addResults[0] : undefined;
                if (callback) {
                    callback.call(context, error || response.addResults[0].error, result)
                }
            }, context)
        }, updateFeature: function (feature, callback, context) {
            feature = geojsonToArcGIS(feature, this.options.idAttribute);
            return this.post("updateFeatures", {features: [feature]}, function (error, response) {
                var result = response && response.updateResults ? response.updateResults[0] : undefined;
                if (callback) {
                    callback.call(context, error || response.updateResults[0].error, result)
                }
            }, context)
        }, deleteFeature: function (id, callback, context) {
            return this.post("deleteFeatures", {objectIds: id}, function (error, response) {
                var result = response && response.deleteResults ? response.deleteResults[0] : undefined;
                if (callback) {
                    callback.call(context, error || response.deleteResults[0].error, result)
                }
            }, context)
        }, deleteFeatures: function (ids, callback, context) {
            return this.post("deleteFeatures", {objectIds: ids}, function (error, response) {
                var result = response && response.deleteResults ? response.deleteResults : undefined;
                if (callback) {
                    callback.call(context, error || response.deleteResults[0].error, result)
                }
            }, context)
        }});
    function featureLayerService(options) {
        return new exports.FeatureLayerService(options)
    }
    var Logo = L.Control.extend({options: {position: "bottomright", marginTop: 0, marginLeft: 0, marginBottom: 0, marginRight: 0}, onAdd: function () {
            var div = L.DomUtil.create("div", "esri-leaflet-logo");
            div.style.marginTop = this.options.marginTop;
            div.style.marginLeft = this.options.marginLeft;
            div.style.marginBottom = this.options.marginBottom;
            div.style.marginRight = this.options.marginRight;
            div.innerHTML = this._adjustLogo(this._map._size);
            this._map.on("resize", function (e) {
                div.innerHTML = this._adjustLogo(e.newSize)
            }, this);
            return div
        }, _adjustLogo: function (mapSize) {
            if (mapSize.x <= 600 || mapSize.y <= 600) {
                return'<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-sm.png" alt="Powered by Esri" style="border: none;"></a>'
            } else {
                return'<a href="https://developers.arcgis.com" style="border: none;"><img src="https://js.arcgis.com/3.13/esri/images/map/logo-med.png" alt="Powered by Esri" style="border: none;"></a>'
            }
        }});
    function logo(options) {
        return new Logo(options)
    }
    var tileProtocol = window.location.protocol !== "https:" ? "http:" : "https:";
    exports.BasemapLayer = L.TileLayer.extend({statics: {TILES: {Streets: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", attributionUrl: "https://static.arcgis.com/attribution/World_Street_Map", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 19, subdomains: ["server", "services"], attribution: "Esri"}}, Topographic: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", attributionUrl: "https://static.arcgis.com/attribution/World_Topo_Map", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 19, subdomains: ["server", "services"], attribution: "Esri"}}, Oceans: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}", attributionUrl: "https://static.arcgis.com/attribution/Ocean_Basemap", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], attribution: "Esri"}}, OceansLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, NationalGeographic: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], attribution: "Esri"}}, DarkGray: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], attribution: "Esri, DeLorme, HERE"}}, DarkGrayLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, Gray: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], attribution: "Esri, NAVTEQ, DeLorme"}}, GrayLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 16, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, Imagery: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 19, subdomains: ["server", "services"], attribution: "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"}}, ImageryLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 19, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, ImageryTransportation: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 19, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, ShadedRelief: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 13, subdomains: ["server", "services"], attribution: "Esri, NAVTEQ, DeLorme"}}, ShadedReliefLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 12, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}, Terrain: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: false, logoPosition: "bottomright", minZoom: 1, maxZoom: 13, subdomains: ["server", "services"],
                        attribution: "Esri, USGS, NOAA"}}, TerrainLabels: {urlTemplate: tileProtocol + "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}", options: {hideLogo: true, logoPosition: "bottomright", minZoom: 1, maxZoom: 13, subdomains: ["server", "services"], pane: pointerEvents ? "esri-labels" : "tilePane"}}}}, initialize: function (key, options) {
            var config;
            if (typeof key === "object" && key.urlTemplate && key.options) {
                config = key
            } else if (typeof key === "string" && exports.BasemapLayer.TILES[key]) {
                config = exports.BasemapLayer.TILES[key]
            } else {
                throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"')
            }
            var tileOptions = L.Util.extend(config.options, options);
            L.TileLayer.prototype.initialize.call(this, config.urlTemplate, L.Util.setOptions(this, tileOptions));
            if (config.attributionUrl) {
                this._getAttributionData(config.attributionUrl)
            }
            this._logo = logo({position: this.options.logoPosition})
        }, onAdd: function (map) {
            if (!this.options.hideLogo && !map._hasEsriLogo) {
                this._logo.addTo(map);
                map._hasEsriLogo = true
            }
            if (this.options.pane === "esri-labels") {
                this._initPane()
            }
            L.TileLayer.prototype.onAdd.call(this, map);
            map.on("moveend", this._updateMapAttribution, this)
        }, onRemove: function (map) {
            if (this._logo && this._logo._container) {
                map.removeControl(this._logo);
                map._hasEsriLogo = false
            }
            L.TileLayer.prototype.onRemove.call(this, map);
            map.off("moveend", this._updateMapAttribution, this)
        }, getAttribution: function () {
            var attribution = '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' + this.options.attribution + "</span>";
            return attribution
        }, _initPane: function () {
            if (!this._map.getPane(this.options.pane)) {
                var pane = this._map.createPane(this.options.pane);
                pane.style.pointerEvents = "none";
                pane.style.zIndex = 500
            }
        }, _getAttributionData: function (url) {
            jsonp(url, {}, L.Util.bind(function (error, attributions) {
                if (error) {
                    return
                }
                this._attributions = [];
                for (var c = 0; c < attributions.contributors.length; c++) {
                    var contributor = attributions.contributors[c];
                    for (var i = 0; i < contributor.coverageAreas.length; i++) {
                        var coverageArea = contributor.coverageAreas[i];
                        var southWest = L.latLng(coverageArea.bbox[0], coverageArea.bbox[1]);
                        var northEast = L.latLng(coverageArea.bbox[2], coverageArea.bbox[3]);
                        this._attributions.push({attribution: contributor.attribution, score: coverageArea.score, bounds: L.latLngBounds(southWest, northEast), minZoom: coverageArea.zoomMin, maxZoom: coverageArea.zoomMax})
                    }
                }
                this._attributions.sort(function (a, b) {
                    return b.score - a.score
                });
                this._updateMapAttribution()
            }, this))
        }, _updateMapAttribution: function () {
            if (this._map && this._map.attributionControl && this._attributions) {
                var newAttributions = "";
                var bounds = this._map.getBounds();
                var zoom = this._map.getZoom();
                for (var i = 0; i < this._attributions.length; i++) {
                    var attribution = this._attributions[i];
                    var text = attribution.attribution;
                    if (!newAttributions.match(text) && bounds.intersects(attribution.bounds) && zoom >= attribution.minZoom && zoom <= attribution.maxZoom) {
                        newAttributions += ", " + text
                    }
                }
                newAttributions = newAttributions.substr(2);
                var attributionElement = this._map.attributionControl._container.querySelector(".esri-attributions");
                attributionElement.innerHTML = newAttributions;
                attributionElement.style.maxWidth = this._map.getSize().x * .65 + "px";
                this.fire("attributionupdated", {attribution: newAttributions})
            }
        }});
    function basemapLayer(key, options) {
        return new exports.BasemapLayer(key, options)
    }
    exports.TiledMapLayer = L.TileLayer.extend({options: {zoomOffsetAllowance: .1, correctZoomLevels: true}, statics: {MercatorZoomLevels: {0: 156543.033928, 1: 78271.5169639999, 2: 39135.7584820001, 3: 19567.8792409999, 4: 9783.93962049996, 5: 4891.96981024998, 6: 2445.98490512499, 7: 1222.99245256249, 8: 611.49622628138, 9: 305.748113140558, 10: 152.874056570411, 11: 76.4370282850732, 12: 38.2185141425366, 13: 19.1092570712683, 14: 9.55462853563415, 15: 4.77731426794937, 16: 2.38865713397468, 17: 1.19432856685505, 18: .597164283559817, 19: .298582141647617, 20: .14929107082381, 21: .07464553541191, 22: .0373227677059525, 23: .0186613838529763}}, initialize: function (options) {
            options.url = cleanUrl(options.url);
            options = L.Util.setOptions(this, options);
            this.tileUrl = options.url + "tile/{z}/{y}/{x}";
            this.service = mapService(options);
            this.service.addEventParent(this);
            if (this.tileUrl.match("://tiles.arcgisonline.com")) {
                this.tileUrl = this.tileUrl.replace("://tiles.arcgisonline.com", "://tiles{s}.arcgisonline.com");
                options.subdomains = ["1", "2", "3", "4"]
            }
            if (this.options.token) {
                this.tileUrl += "?token=" + this.options.token
            }
            L.TileLayer.prototype.initialize.call(this, this.tileUrl, options)
        }, getTileUrl: function (tilePoint) {
            return L.Util.template(this.tileUrl, L.extend({s: this._getSubdomain(tilePoint), z: this._lodMap[tilePoint.z] || tilePoint.z, x: tilePoint.x, y: tilePoint.y}, this.options))
        }, onAdd: function (map) {
            if (!this._lodMap && this.options.correctZoomLevels) {
                this._lodMap = {};
                this.metadata(function (error, metadata) {
                    if (!error) {
                        var sr = metadata.spatialReference.latestWkid || metadata.spatialReference.wkid;
                        if (sr === 102100 || sr === 3857) {
                            var arcgisLODs = metadata.tileInfo.lods;
                            var correctResolutions = exports.TiledMapLayer.MercatorZoomLevels;
                            for (var i = 0; i < arcgisLODs.length; i++) {
                                var arcgisLOD = arcgisLODs[i];
                                for (var ci in correctResolutions) {
                                    var correctRes = correctResolutions[ci];
                                    if (this._withinPercentage(arcgisLOD.resolution, correctRes, this.options.zoomOffsetAllowance)) {
                                        this._lodMap[ci] = arcgisLOD.level;
                                        break
                                    }
                                }
                            }
                        } else {
                            warn("L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html")
                        }
                    }
                    L.TileLayer.prototype.onAdd.call(this, map)
                }, this)
            } else {
                L.TileLayer.prototype.onAdd.call(this, map)
            }
        }, metadata: function (callback, context) {
            this.service.metadata(callback, context);
            return this
        }, identify: function () {
            return this.service.identify()
        }, find: function () {
            return this.service.find()
        }, query: function () {
            return this.service.query()
        }, authenticate: function (token) {
            var tokenQs = "?token=" + token;
            this.tileUrl = this.options.token ? this.tileUrl.replace(/\?token=(.+)/g, tokenQs) : this.tileUrl + tokenQs;
            this.options.token = token;
            this.service.authenticate(token);
            return this
        }, _withinPercentage: function (a, b, percentage) {
            var diff = Math.abs(a / b - 1);
            return diff < percentage
        }});
    function tiledMapLayer(url, options) {
        return new exports.TiledMapLayer(url, options)
    }
    exports.RasterLayer = L.Layer.extend({options: {opacity: 1, position: "front", f: "image", useCors: cors, attribution: null, interactive: false, alt: ""}, onAdd: function (map) {
            this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
            if (map.options.crs && map.options.crs.code) {
                var sr = map.options.crs.code.split(":")[1];
                this.options.bboxSR = sr;
                this.options.imageSR = sr
            }
            map.on("moveend", this._update, this);
            if (this._currentImage && this._currentImage._bounds.equals(this._map.getBounds())) {
                map.addLayer(this._currentImage)
            } else if (this._currentImage) {
                this._map.removeLayer(this._currentImage);
                this._currentImage = null
            }
            this._update();
            if (this._popup) {
                this._map.on("click", this._getPopupData, this);
                this._map.on("dblclick", this._resetPopupState, this)
            }
        }, onRemove: function (map) {
            if (this._currentImage) {
                this._map.removeLayer(this._currentImage)
            }
            if (this._popup) {
                this._map.off("click", this._getPopupData, this);
                this._map.off("dblclick", this._resetPopupState, this)
            }
            this._map.off("moveend", this._update, this)
        }, getEvents: function () {
            return{moveend: this._update}
        }, bindPopup: function (fn, popupOptions) {
            this._shouldRenderPopup = false;
            this._lastClick = false;
            this._popup = L.popup(popupOptions);
            this._popupFunction = fn;
            if (this._map) {
                this._map.on("click", this._getPopupData, this);
                this._map.on("dblclick", this._resetPopupState, this)
            }
            return this
        }, unbindPopup: function () {
            if (this._map) {
                this._map.closePopup(this._popup);
                this._map.off("click", this._getPopupData, this);
                this._map.off("dblclick", this._resetPopupState, this)
            }
            this._popup = false;
            return this
        }, bringToFront: function () {
            this.options.position = "front";
            if (this._currentImage) {
                this._currentImage.bringToFront()
            }
            return this
        }, bringToBack: function () {
            this.options.position = "back";
            if (this._currentImage) {
                this._currentImage.bringToBack()
            }
            return this
        }, getAttribution: function () {
            return this.options.attribution
        }, getOpacity: function () {
            return this.options.opacity
        }, setOpacity: function (opacity) {
            this.options.opacity = opacity;
            this._currentImage.setOpacity(opacity);
            return this
        }, getTimeRange: function () {
            return[this.options.from, this.options.to]
        }, setTimeRange: function (from, to) {
            this.options.from = from;
            this.options.to = to;
            this._update();
            return this
        }, metadata: function (callback, context) {
            this.service.metadata(callback, context);
            return this
        }, authenticate: function (token) {
            this.service.authenticate(token);
            return this
        }, _renderImage: function (url, bounds) {
            if (this._map) {
                var image = L.imageOverlay(url, bounds, {opacity: 0, crossOrigin: this.options.useCors, alt: this.options.alt, pane: this.options.pane || this.getPane(), interactive: this.options.interactive}).addTo(this._map);
                image.once("load", function (e) {
                    if (this._map) {
                        var newImage = e.target;
                        var oldImage = this._currentImage;
                        if (newImage._bounds.equals(bounds) && newImage._bounds.equals(this._map.getBounds())) {
                            this._currentImage = newImage;
                            if (this.options.position === "front") {
                                this.bringToFront()
                            } else {
                                this.bringToBack()
                            }
                            if (this._map && this._currentImage._map) {
                                this._currentImage.setOpacity(this.options.opacity)
                            } else {
                                this._currentImage._map.removeLayer(this._currentImage)
                            }
                            if (oldImage && this._map) {
                                this._map.removeLayer(oldImage)
                            }
                            if (oldImage && oldImage._map) {
                                oldImage._map.removeLayer(oldImage)
                            }
                        } else {
                            this._map.removeLayer(newImage)
                        }
                    }
                    this.fire("load", {bounds: bounds})
                }, this);
                this.fire("loading", {bounds: bounds})
            }
        }, _update: function () {
            if (!this._map) {
                return
            }
            var zoom = this._map.getZoom();
            var bounds = this._map.getBounds();
            if (this._animatingZoom) {
                return
            }
            if (this._map._panTransition && this._map._panTransition._inProgress) {
                return
            }
            if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
                return
            }
            var params = this._buildExportParams();
            this._requestExport(params, bounds)
        }, _renderPopup: function (latlng, error, results, response) {
            latlng = L.latLng(latlng);
            if (this._shouldRenderPopup && this._lastClick.equals(latlng)) {
                var content = this._popupFunction(error, results, response);
                if (content) {
                    this._popup.setLatLng(latlng).setContent(content).openOn(this._map)
                }
            }
        }, _resetPopupState: function (e) {
            this._shouldRenderPopup = false;
            this._lastClick = e.latlng
        }});
    exports.ImageMapLayer = exports.RasterLayer.extend({options: {updateInterval: 150, format: "jpgpng", transparent: true, f: "json"}, query: function () {
            return this.service.query()
        }, identify: function () {
            return this.service.identify()
        }, initialize: function (options) {
            options.url = cleanUrl(options.url);
            this.service = imageService(options);
            this.service.addEventParent(this);
            L.Util.setOptions(this, options)
        }, setPixelType: function (pixelType) {
            this.options.pixelType = pixelType;
            this._update();
            return this
        }, getPixelType: function () {
            return this.options.pixelType
        }, setBandIds: function (bandIds) {
            if (L.Util.isArray(bandIds)) {
                this.options.bandIds = bandIds.join(",")
            } else {
                this.options.bandIds = bandIds.toString()
            }
            this._update();
            return this
        }, getBandIds: function () {
            return this.options.bandIds
        }, setNoData: function (noData, noDataInterpretation) {
            if (L.Util.isArray(noData)) {
                this.options.noData = noData.join(",")
            } else {
                this.options.noData = noData.toString()
            }
            if (noDataInterpretation) {
                this.options.noDataInterpretation = noDataInterpretation
            }
            this._update();
            return this
        }, getNoData: function () {
            return this.options.noData
        }, getNoDataInterpretation: function () {
            return this.options.noDataInterpretation
        }, setRenderingRule: function (renderingRule) {
            this.options.renderingRule = renderingRule;
            this._update()
        }, getRenderingRule: function () {
            return this.options.renderingRule
        }, setMosaicRule: function (mosaicRule) {
            this.options.mosaicRule = mosaicRule;
            this._update()
        }, getMosaicRule: function () {
            return this.options.mosaicRule
        }, _getPopupData: function (e) {
            var callback = L.Util.bind(function (error, results, response) {
                if (error) {
                    return
                }
                setTimeout(L.Util.bind(function () {
                    this._renderPopup(e.latlng, error, results, response)
                }, this), 300)
            }, this);
            var identifyRequest = this.identify().at(e.latlng);
            if (this.options.mosaicRule) {
                identifyRequest.setMosaicRule(this.options.mosaicRule)
            }
            identifyRequest.run(callback);
            this._shouldRenderPopup = true;
            this._lastClick = e.latlng
        }, _buildExportParams: function () {
            var bounds = this._map.getBounds();
            var size = this._map.getSize();
            var ne = this._map.options.crs.project(bounds._northEast);
            var sw = this._map.options.crs.project(bounds._southWest);
            var params = {bbox: [sw.x, sw.y, ne.x, ne.y].join(","), size: size.x + "," + size.y, format: this.options.format, transparent: this.options.transparent, bboxSR: this.options.bboxSR, imageSR: this.options.imageSR};
            if (this.options.from && this.options.to) {
                params.time = this.options.from.valueOf() + "," + this.options.to.valueOf()
            }
            if (this.options.pixelType) {
                params.pixelType = this.options.pixelType
            }
            if (this.options.interpolation) {
                params.interpolation = this.options.interpolation
            }
            if (this.options.compressionQuality) {
                params.compressionQuality = this.options.compressionQuality
            }
            if (this.options.bandIds) {
                params.bandIds = this.options.bandIds
            }
            if (this.options.noData) {
                params.noData = this.options.noData
            }
            if (this.options.noDataInterpretation) {
                params.noDataInterpretation = this.options.noDataInterpretation
            }
            if (this.service.options.token) {
                params.token = this.service.options.token
            }
            if (this.options.renderingRule) {
                params.renderingRule = JSON.stringify(this.options.renderingRule)
            }
            if (this.options.mosaicRule) {
                params.mosaicRule = JSON.stringify(this.options.mosaicRule)
            }
            return params
        }, _requestExport: function (params, bounds) {
            if (this.options.f === "json") {
                this.service.get("exportImage", params, function (error, response) {
                    if (error) {
                        return
                    }
                    this._renderImage(response.href, bounds)
                }, this)
            } else {
                params.f = "image";
                this._renderImage(this.options.url + "exportImage" + L.Util.getParamString(params), bounds)
            }
        }});
    function imageMapLayer(url, options) {
        return new exports.ImageMapLayer(url, options)
    }
    exports.DynamicMapLayer = exports.RasterLayer.extend({options: {updateInterval: 150, layers: false, layerDefs: false, timeOptions: false, format: "png24", transparent: true, f: "json"}, initialize: function (options) {
            options.url = cleanUrl(options.url);
            this.service = mapService(options);
            this.service.addEventParent(this);
            if ((options.proxy || options.token) && options.f !== "json") {
                options.f = "json"
            }
            L.Util.setOptions(this, options)
        }, getDynamicLayers: function () {
            return this.options.dynamicLayers
        }, setDynamicLayers: function (dynamicLayers) {
            this.options.dynamicLayers = dynamicLayers;
            this._update();
            return this
        }, getLayers: function () {
            return this.options.layers
        }, setLayers: function (layers) {
            this.options.layers = layers;
            this._update();
            return this
        }, getLayerDefs: function () {
            return this.options.layerDefs
        }, setLayerDefs: function (layerDefs) {
            this.options.layerDefs = layerDefs;
            this._update();
            return this
        }, getTimeOptions: function () {
            return this.options.timeOptions
        }, setTimeOptions: function (timeOptions) {
            this.options.timeOptions = timeOptions;
            this._update();
            return this
        }, query: function () {
            return this.service.query()
        }, identify: function () {
            return this.service.identify()
        }, find: function () {
            return this.service.find()
        }, _getPopupData: function (e) {
            var callback = L.Util.bind(function (error, featureCollection, response) {
                if (error) {
                    return
                }
                setTimeout(L.Util.bind(function () {
                    this._renderPopup(e.latlng, error, featureCollection, response)
                }, this), 300)
            }, this);
            var identifyRequest = this.identify().on(this._map).at(e.latlng);
            if (this.options.layers) {
                identifyRequest.layers("visible:" + this.options.layers.join(","))
            } else {
                identifyRequest.layers("visible")
            }
            identifyRequest.run(callback);
            this._shouldRenderPopup = true;
            this._lastClick = e.latlng
        }, _buildExportParams: function () {
            var bounds = this._map.getBounds();
            var size = this._map.getSize();
            var ne = this._map.options.crs.project(bounds._northEast);
            var sw = this._map.options.crs.project(bounds._southWest);
            var top = this._map.latLngToLayerPoint(bounds._northEast);
            var bottom = this._map.latLngToLayerPoint(bounds._southWest);
            if (top.y > 0 || bottom.y < size.y) {
                size.y = bottom.y - top.y
            }
            var params = {bbox: [sw.x, sw.y, ne.x, ne.y].join(","), size: size.x + "," + size.y, dpi: 96, format: this.options.format, transparent: this.options.transparent, bboxSR: this.options.bboxSR, imageSR: this.options.imageSR};
            if (this.options.dynamicLayers) {
                params.dynamicLayers = this.options.dynamicLayers
            }
            if (this.options.layers) {
                params.layers = "show:" + this.options.layers.join(",")
            }
            if (this.options.layerDefs) {
                params.layerDefs = JSON.stringify(this.options.layerDefs)
            }
            if (this.options.timeOptions) {
                params.timeOptions = JSON.stringify(this.options.timeOptions)
            }
            if (this.options.from && this.options.to) {
                params.time = this.options.from.valueOf() + "," + this.options.to.valueOf()
            }
            if (this.service.options.token) {
                params.token = this.service.options.token
            }
            return params
        }, _requestExport: function (params, bounds) {
            if (this.options.f === "json") {
                this.service.get("export", params, function (error, response) {
                    if (error) {
                        return
                    }
                    this._renderImage(response.href, bounds)
                }, this)
            } else {
                params.f = "image";
                this._renderImage(this.options.url + "export" + L.Util.getParamString(params), bounds)
            }
        }});
    function dynamicMapLayer(url, options) {
        return new exports.DynamicMapLayer(url, options)
    }
    exports.FeatureGrid = L.Layer.extend({options: {cellSize: 512, updateInterval: 150}, initialize: function (options) {
            options = L.setOptions(this, options);
            this._zooming = false
        }, onAdd: function (map) {
            this._map = map;
            this._update = L.Util.throttle(this._update, this.options.updateInterval, this);
            this._reset();
            this._update()
        }, onRemove: function () {
            this._map.removeEventListener(this.getEvents(), this);
            this._removeCells()
        }, getEvents: function () {
            var events = {moveend: this._update, zoomstart: this._zoomstart, zoomend: this._reset};
            return events
        }, addTo: function (map) {
            map.addLayer(this);
            return this
        }, removeFrom: function (map) {
            map.removeLayer(this);
            return this
        }, _zoomstart: function () {
            this._zooming = true
        }, _reset: function () {
            this._removeCells();
            this._cells = {};
            this._activeCells = {};
            this._cellsToLoad = 0;
            this._cellsTotal = 0;
            this._cellNumBounds = this._getCellNumBounds();
            this._resetWrap();
            this._zooming = false
        }, _resetWrap: function () {
            var map = this._map;
            var crs = map.options.crs;
            if (crs.infinite) {
                return
            }
            var cellSize = this._getCellSize();
            if (crs.wrapLng) {
                this._wrapLng = [Math.floor(map.project([0, crs.wrapLng[0]]).x / cellSize), Math.ceil(map.project([0, crs.wrapLng[1]]).x / cellSize)]
            }
            if (crs.wrapLat) {
                this._wrapLat = [Math.floor(map.project([crs.wrapLat[0], 0]).y / cellSize), Math.ceil(map.project([crs.wrapLat[1], 0]).y / cellSize)]
            }
        }, _getCellSize: function () {
            return this.options.cellSize
        }, _update: function () {
            if (!this._map) {
                return
            }
            var bounds = this._map.getPixelBounds();
            var zoom = this._map.getZoom();
            var cellSize = this._getCellSize();
            if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
                return
            }
            var cellBounds = L.bounds(bounds.min.divideBy(cellSize).floor(), bounds.max.divideBy(cellSize).floor());
            this._removeOtherCells(cellBounds);
            this._addCells(cellBounds)
        }, _addCells: function (bounds) {
            var queue = [];
            var center = bounds.getCenter();
            var zoom = this._map.getZoom();
            var j, i, coords;
            for (j = bounds.min.y; j <= bounds.max.y; j++) {
                for (i = bounds.min.x; i <= bounds.max.x; i++) {
                    coords = L.point(i, j);
                    coords.z = zoom;
                    if (this._isValidCell(coords)) {
                        queue.push(coords)
                    }
                }
            }
            var cellsToLoad = queue.length;
            if (cellsToLoad === 0) {
                return
            }
            this._cellsToLoad += cellsToLoad;
            this._cellsTotal += cellsToLoad;
            queue.sort(function (a, b) {
                return a.distanceTo(center) - b.distanceTo(center)
            });
            for (i = 0; i < cellsToLoad; i++) {
                this._addCell(queue[i])
            }
        }, _isValidCell: function (coords) {
            var crs = this._map.options.crs;
            if (!crs.infinite) {
                var bounds = this._cellNumBounds;
                if (!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x) || !crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y)) {
                    return false
                }
            }
            if (!this.options.bounds) {
                return true
            }
            var cellBounds = this._cellCoordsToBounds(coords);
            return L.latLngBounds(this.options.bounds).intersects(cellBounds)
        }, _cellCoordsToBounds: function (coords) {
            var map = this._map;
            var cellSize = this.options.cellSize;
            var nwPoint = coords.multiplyBy(cellSize);
            var sePoint = nwPoint.add([cellSize, cellSize]);
            var nw = map.wrapLatLng(map.unproject(nwPoint, coords.z));
            var se = map.wrapLatLng(map.unproject(sePoint, coords.z));
            return L.latLngBounds(nw, se)
        }, _cellCoordsToKey: function (coords) {
            return coords.x + ":" + coords.y
        }, _keyToCellCoords: function (key) {
            var kArr = key.split(":");
            var x = parseInt(kArr[0], 10);
            var y = parseInt(kArr[1], 10);
            return L.point(x, y)
        }, _removeOtherCells: function (bounds) {
            for (var key in this._cells) {
                if (!bounds.contains(this._keyToCellCoords(key))) {
                    this._removeCell(key)
                }
            }
        }, _removeCell: function (key) {
            var cell = this._activeCells[key];
            if (cell) {
                delete this._activeCells[key];
                if (this.cellLeave) {
                    this.cellLeave(cell.bounds, cell.coords)
                }
                this.fire("cellleave", {bounds: cell.bounds, coords: cell.coords})
            }
        }, _removeCells: function () {
            for (var key in this._cells) {
                var bounds = this._cells[key].bounds;
                var coords = this._cells[key].coords;
                if (this.cellLeave) {
                    this.cellLeave(bounds, coords)
                }
                this.fire("cellleave", {bounds: bounds, coords: coords})
            }
        }, _addCell: function (coords) {
            this._wrapCoords(coords);
            var key = this._cellCoordsToKey(coords);
            var cell = this._cells[key];
            if (cell && !this._activeCells[key]) {
                if (this.cellEnter) {
                    this.cellEnter(cell.bounds, coords)
                }
                this.fire("cellenter", {bounds: cell.bounds, coords: coords});
                this._activeCells[key] = cell
            }
            if (!cell) {
                cell = {coords: coords, bounds: this._cellCoordsToBounds(coords)};
                this._cells[key] = cell;
                this._activeCells[key] = cell;
                if (this.createCell) {
                    this.createCell(cell.bounds, coords)
                }
                this.fire("cellcreate", {bounds: cell.bounds, coords: coords})
            }
        }, _wrapCoords: function (coords) {
            coords.x = this._wrapLng ? L.Util.wrapNum(coords.x, this._wrapLng) : coords.x;
            coords.y = this._wrapLat ? L.Util.wrapNum(coords.y, this._wrapLat) : coords.y
        }, _getCellNumBounds: function () {
            var bounds = this._map.getPixelWorldBounds();
            var size = this._getCellSize();
            return bounds ? L.bounds(bounds.min.divideBy(size).floor(), bounds.max.divideBy(size).ceil().subtract([1, 1])) : null
        }});
    exports.FeatureManager = exports.FeatureGrid.extend({options: {attribution: null, where: "1=1", fields: ["*"], from: false, to: false, timeField: false, timeFilterMode: "server", simplifyFactor: 0, precision: 6}, initialize: function (options) {
            exports.FeatureGrid.prototype.initialize.call(this, options);
            options.url = cleanUrl(options.url);
            options = L.setOptions(this, options);
            this.service = featureLayerService(options);
            this.service.addEventParent(this);
            if (this.options.fields[0] !== "*") {
                var oidCheck = false;
                for (var i = 0; i < this.options.fields.length; i++) {
                    if (this.options.fields[i].match(/^(OBJECTID|FID|OID|ID)$/i)) {
                        oidCheck = true
                    }
                }
                if (oidCheck === false) {
                    warn("no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.")
                }
            }
            if (this.options.timeField.start && this.options.timeField.end) {
                this._startTimeIndex = new BinarySearchIndex;
                this._endTimeIndex = new BinarySearchIndex
            } else if (this.options.timeField) {
                this._timeIndex = new BinarySearchIndex
            }
            this._cache = {};
            this._currentSnapshot = [];
            this._activeRequests = 0
        }, onAdd: function (map) {
            return exports.FeatureGrid.prototype.onAdd.call(this, map)
        }, onRemove: function (map) {
            return exports.FeatureGrid.prototype.onRemove.call(this, map)
        }, getAttribution: function () {
            return this.options.attribution
        }, createCell: function (bounds, coords) {
            this._requestFeatures(bounds, coords)
        }, _requestFeatures: function (bounds, coords, callback) {
            this._activeRequests++;
            if (this._activeRequests === 1) {
                this.fire("loading", {bounds: bounds}, true)
            }
            return this._buildQuery(bounds).run(function (error, featureCollection, response) {
                if (response && response.exceededTransferLimit) {
                    this.fire("drawlimitexceeded")
                }
                if (!error && featureCollection && featureCollection.features.length) {
                    L.Util.requestAnimFrame(L.Util.bind(function () {
                        this._addFeatures(featureCollection.features, coords);
                        this._postProcessFeatures(bounds)
                    }, this))
                }
                if (!error && featureCollection && !featureCollection.features.length) {
                    this._postProcessFeatures(bounds)
                }
                if (callback) {
                    callback.call(this, error, featureCollection)
                }
            }, this)
        }, _postProcessFeatures: function (bounds) {
            this._activeRequests--;
            if (this._activeRequests <= 0) {
                this.fire("load", {bounds: bounds})
            }
        }, _cacheKey: function (coords) {
            return coords.z + ":" + coords.x + ":" + coords.y
        }, _addFeatures: function (features, coords) {
            var key = this._cacheKey(coords);
            this._cache[key] = this._cache[key] || [];
            for (var i = features.length - 1; i >= 0; i--) {
                var id = features[i].id;
                this._currentSnapshot.push(id);
                this._cache[key].push(id)
            }
            if (this.options.timeField) {
                this._buildTimeIndexes(features)
            }
            var zoom = this._map.getZoom();
            if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
                return
            }
            this.createLayers(features)
        }, _buildQuery: function (bounds) {
            var query = this.service.query().intersects(bounds).where(this.options.where).fields(this.options.fields).precision(this.options.precision);
            if (this.options.simplifyFactor) {
                query.simplify(this._map, this.options.simplifyFactor)
            }
            if (this.options.timeFilterMode === "server" && this.options.from && this.options.to) {
                query.between(this.options.from, this.options.to)
            }
            return query
        }, setWhere: function (where, callback, context) {
            this.options.where = where && where.length ? where : "1=1";
            var oldSnapshot = [];
            var newSnapshot = [];
            var pendingRequests = 0;
            var requestError = null;
            var requestCallback = L.Util.bind(function (error, featureCollection) {
                if (error) {
                    requestError = error
                }
                if (featureCollection) {
                    for (var i = featureCollection.features.length - 1; i >= 0; i--) {
                        newSnapshot.push(featureCollection.features[i].id)
                    }
                }
                pendingRequests--;
                if (pendingRequests <= 0) {
                    this._currentSnapshot = newSnapshot;
                    L.Util.requestAnimFrame(L.Util.bind(function () {
                        this.removeLayers(oldSnapshot);
                        this.addLayers(newSnapshot);
                        if (callback) {
                            callback.call(context, requestError)
                        }
                    }, this))
                }
            }, this);
            for (var i = this._currentSnapshot.length - 1; i >= 0; i--) {
                oldSnapshot.push(this._currentSnapshot[i])
            }
            for (var key in this._activeCells) {
                pendingRequests++;
                var coords = this._keyToCellCoords(key);
                var bounds = this._cellCoordsToBounds(coords);
                this._requestFeatures(bounds, key, requestCallback)
            }
            return this
        }, getWhere: function () {
            return this.options.where
        }, getTimeRange: function () {
            return[this.options.from, this.options.to]
        }, setTimeRange: function (from, to, callback, context) {
            var oldFrom = this.options.from;
            var oldTo = this.options.to;
            var pendingRequests = 0;
            var requestError = null;
            var requestCallback = L.Util.bind(function (error) {
                if (error) {
                    requestError = error
                }
                this._filterExistingFeatures(oldFrom, oldTo, from, to);
                pendingRequests--;
                if (callback && pendingRequests <= 0) {
                    callback.call(context, requestError)
                }
            }, this);
            this.options.from = from;
            this.options.to = to;
            this._filterExistingFeatures(oldFrom, oldTo, from, to);
            if (this.options.timeFilterMode === "server") {
                for (var key in this._activeCells) {
                    pendingRequests++;
                    var coords = this._keyToCellCoords(key);
                    var bounds = this._cellCoordsToBounds(coords);
                    this._requestFeatures(bounds, key, requestCallback)
                }
            }
            return this
        }, refresh: function () {
            for (var key in this._activeCells) {
                var coords = this._keyToCellCoords(key);
                var bounds = this._cellCoordsToBounds(coords);
                this._requestFeatures(bounds, key)
            }
            if (this.redraw) {
                this.once("load", function () {
                    this.eachFeature(function (layer) {
                        this._redraw(layer.feature.id)
                    }, this)
                }, this)
            }
        }, _filterExistingFeatures: function (oldFrom, oldTo, newFrom, newTo) {
            var layersToRemove = oldFrom && oldTo ? this._getFeaturesInTimeRange(oldFrom, oldTo) : this._currentSnapshot;
            var layersToAdd = this._getFeaturesInTimeRange(newFrom, newTo);
            if (layersToAdd.indexOf) {
                for (var i = 0; i < layersToAdd.length; i++) {
                    var shouldRemoveLayer = layersToRemove.indexOf(layersToAdd[i]);
                    if (shouldRemoveLayer >= 0) {
                        layersToRemove.splice(shouldRemoveLayer, 1)
                    }
                }
            }
            L.Util.requestAnimFrame(L.Util.bind(function () {
                this.removeLayers(layersToRemove);
                this.addLayers(layersToAdd)
            }, this))
        }, _getFeaturesInTimeRange: function (start, end) {
            var ids = [];
            var search;
            if (this.options.timeField.start && this.options.timeField.end) {
                var startTimes = this._startTimeIndex.between(start, end);
                var endTimes = this._endTimeIndex.between(start, end);
                search = startTimes.concat(endTimes)
            } else {
                search = this._timeIndex.between(start, end)
            }
            for (var i = search.length - 1; i >= 0; i--) {
                ids.push(search[i].id)
            }
            return ids
        }, _buildTimeIndexes: function (geojson) {
            var i;
            var feature;
            if (this.options.timeField.start && this.options.timeField.end) {
                var startTimeEntries = [];
                var endTimeEntries = [];
                for (i = geojson.length - 1; i >= 0; i--) {
                    feature = geojson[i];
                    startTimeEntries.push({id: feature.id, value: new Date(feature.properties[this.options.timeField.start])});
                    endTimeEntries.push({id: feature.id, value: new Date(feature.properties[this.options.timeField.end])})
                }
                this._startTimeIndex.bulkAdd(startTimeEntries);
                this._endTimeIndex.bulkAdd(endTimeEntries)
            } else {
                var timeEntries = [];
                for (i = geojson.length - 1; i >= 0; i--) {
                    feature = geojson[i];
                    timeEntries.push({id: feature.id, value: new Date(feature.properties[this.options.timeField])})
                }
                this._timeIndex.bulkAdd(timeEntries)
            }
        }, _featureWithinTimeRange: function (feature) {
            if (!this.options.from || !this.options.to) {
                return true
            }
            var from = +this.options.from.valueOf();
            var to = +this.options.to.valueOf();
            if (typeof this.options.timeField === "string") {
                var date = +feature.properties[this.options.timeField];
                return date >= from && date <= to
            }
            if (this.options.timeField.start && this.options.timeField.end) {
                var startDate = +feature.properties[this.options.timeField.start];
                var endDate = +feature.properties[this.options.timeField.end];
                return startDate >= from && startDate <= to || endDate >= from && endDate <= to
            }
        }, authenticate: function (token) {
            this.service.authenticate(token);
            return this
        }, metadata: function (callback, context) {
            this.service.metadata(callback, context);
            return this
        }, query: function () {
            return this.service.query()
        }, _getMetadata: function (callback) {
            if (this._metadata) {
                var error;
                callback(error, this._metadata)
            } else {
                this.metadata(L.Util.bind(function (error, response) {
                    this._metadata = response;
                    callback(error, this._metadata)
                }, this))
            }
        }, addFeature: function (feature, callback, context) {
            this._getMetadata(L.Util.bind(function (error, metadata) {
                if (error) {
                    if (callback) {
                        callback.call(this, error, null)
                    }
                    return
                }
                this.service.addFeature(feature, L.Util.bind(function (error, response) {
                    if (!error) {
                        feature.properties[metadata.objectIdField] = response.objectId;
                        feature.id = response.objectId;
                        this.createLayers([feature])
                    }
                    if (callback) {
                        callback.call(context, error, response)
                    }
                }, this))
            }, this))
        }, updateFeature: function (feature, callback, context) {
            this.service.updateFeature(feature, function (error, response) {
                if (!error) {
                    this.removeLayers([feature.id], true);
                    this.createLayers([feature])
                }
                if (callback) {
                    callback.call(context, error, response)
                }
            }, this)
        }, deleteFeature: function (id, callback, context) {
            this.service.deleteFeature(id, function (error, response) {
                if (!error && response.objectId) {
                    this.removeLayers([response.objectId], true)
                }
                if (callback) {
                    callback.call(context, error, response)
                }
            }, this)
        }, deleteFeatures: function (ids, callback, context) {
            return this.service.deleteFeatures(ids, function (error, response) {
                if (!error && response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        this.removeLayers([response[i].objectId], true)
                    }
                }
                if (callback) {
                    callback.call(context, error, response)
                }
            }, this)
        }});
    function BinarySearchIndex(values) {
        this.values = values || []
    }
    BinarySearchIndex.prototype._query = function (query) {
        var minIndex = 0;
        var maxIndex = this.values.length - 1;
        var currentIndex;
        var currentElement;
        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = this.values[Math.round(currentIndex)];
            if (+currentElement.value < +query) {
                minIndex = currentIndex + 1
            } else if (+currentElement.value > +query) {
                maxIndex = currentIndex - 1
            } else {
                return currentIndex
            }
        }
        return~maxIndex
    };
    BinarySearchIndex.prototype.sort = function () {
        this.values.sort(function (a, b) {
            return+b.value - +a.value
        }).reverse();
        this.dirty = false
    };
    BinarySearchIndex.prototype.between = function (start, end) {
        if (this.dirty) {
            this.sort()
        }
        var startIndex = this._query(start);
        var endIndex = this._query(end);
        if (startIndex === 0 && endIndex === 0) {
            return[]
        }
        startIndex = Math.abs(startIndex);
        endIndex = endIndex < 0 ? Math.abs(endIndex) : endIndex + 1;
        return this.values.slice(startIndex, endIndex)
    };
    BinarySearchIndex.prototype.bulkAdd = function (items) {
        this.dirty = true;
        this.values = this.values.concat(items)
    };
    exports.FeatureLayer = exports.FeatureManager.extend({options: {cacheLayers: true}, initialize: function (options) {
            exports.FeatureManager.prototype.initialize.call(this, options);
            this._originalStyle = this.options.style;
            this._layers = {}
        }, onRemove: function (map) {
            for (var i in this._layers) {
                map.removeLayer(this._layers[i])
            }
            return exports.FeatureManager.prototype.onRemove.call(this, map)
        }, createNewLayer: function (geojson) {
            var layer = L.GeoJSON.geometryToLayer(geojson, this.options);
            layer.defaultOptions = layer.options;
            return layer
        }, _updateLayer: function (layer, geojson) {
            var latlngs = [];
            var coordsToLatLng = this.options.coordsToLatLng || L.GeoJSON.coordsToLatLng;
            if (geojson.properties) {
                layer.feature.properties = geojson.properties
            }
            switch (geojson.geometry.type) {
                case"Point":
                    latlngs = L.GeoJSON.coordsToLatLng(geojson.geometry.coordinates);
                    layer.setLatLng(latlngs);
                    break;
                case"LineString":
                    latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 0, coordsToLatLng);
                    layer.setLatLngs(latlngs);
                    break;
                case"MultiLineString":
                    latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
                    layer.setLatLngs(latlngs);
                    break;
                case"Polygon":
                    latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 1, coordsToLatLng);
                    layer.setLatLngs(latlngs);
                    break;
                case"MultiPolygon":
                    latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates, 2, coordsToLatLng);
                    layer.setLatLngs(latlngs);
                    break
                }
        }, createLayers: function (features) {
            for (var i = features.length - 1; i >= 0; i--) {
                var geojson = features[i];
                var layer = this._layers[geojson.id];
                var newLayer;
                if (layer && !this._map.hasLayer(layer)) {
                    this._map.addLayer(layer)
                }
                if (layer && this.options.simplifyFactor > 0 && (layer.setLatLngs || layer.setLatLng)) {
                    this._updateLayer(layer, geojson)
                }
                if (!layer) {
                    newLayer = this.createNewLayer(geojson);
                    newLayer.feature = geojson;
                    newLayer.addEventParent(this);
                    if (this.options.onEachFeature) {
                        this.options.onEachFeature(newLayer.feature, newLayer)
                    }
                    this._layers[newLayer.feature.id] = newLayer;
                    this.setFeatureStyle(newLayer.feature.id, this.options.style);
                    this.fire("createfeature", {feature: newLayer.feature}, true);
                    if (!this.options.timeField || this.options.timeField && this._featureWithinTimeRange(geojson)) {
                        this._map.addLayer(newLayer)
                    }
                }
            }
        }, addLayers: function (ids) {
            for (var i = ids.length - 1; i >= 0; i--) {
                var layer = this._layers[ids[i]];
                if (layer) {
                    this.fire("addfeature", {feature: layer.feature}, true);
                    this._map.addLayer(layer)
                }
            }
        }, removeLayers: function (ids, permanent) {
            for (var i = ids.length - 1; i >= 0; i--) {
                var id = ids[i];
                var layer = this._layers[id];
                if (layer) {
                    this.fire("removefeature", {feature: layer.feature, permanent: permanent}, true);
                    this._map.removeLayer(layer)
                }
                if (layer && permanent) {
                    delete this._layers[id]
                }
            }
        }, cellEnter: function (bounds, coords) {
            console.log(this._zooming);
            if (!this._zooming) {
                L.Util.requestAnimFrame(L.Util.bind(function () {
                    var cacheKey = this._cacheKey(coords);
                    var cellKey = this._cellCoordsToKey(coords);
                    var layers = this._cache[cacheKey];
                    if (this._activeCells[cellKey] && layers) {
                        this.addLayers(layers)
                    }
                }, this))
            }
        }, cellLeave: function (bounds, coords) {
            console.log(this._zooming);
            if (!this._zooming) {
                L.Util.requestAnimFrame(L.Util.bind(function () {
                    var cacheKey = this._cacheKey(coords);
                    var cellKey = this._cellCoordsToKey(coords);
                    var layers = this._cache[cacheKey];
                    var mapBounds = this._map.getBounds();
                    if (!this._activeCells[cellKey] && layers) {
                        var removable = true;
                        for (var i = 0; i < layers.length; i++) {
                            var layer = this._layers[layers[i]];
                            if (layer && layer.getBounds && mapBounds.intersects(layer.getBounds())) {
                                removable = false
                            }
                        }
                        if (removable) {
                            this.removeLayers(layers, !this.options.cacheLayers)
                        }
                        if (!this.options.cacheLayers && removable) {
                            delete this._cache[cacheKey];
                            delete this._cells[cellKey];
                            delete this._activeCells[cellKey]
                        }
                    }
                }, this))
            }
        }, resetStyle: function () {
            this.options.style = this._originalStyle;
            this.eachFeature(function (layer) {
                this.resetFeatureStyle(layer.feature.id)
            }, this);
            return this
        }, setStyle: function (style) {
            this.options.style = style;
            this.eachFeature(function (layer) {
                this.setFeatureStyle(layer.feature.id, style)
            }, this);
            return this
        }, resetFeatureStyle: function (id) {
            var layer = this._layers[id];
            var style = this._originalStyle || L.Path.prototype.options;
            if (layer) {
                L.Util.extend(layer.options, layer.defaultOptions);
                this.setFeatureStyle(id, style)
            }
            return this
        }, setFeatureStyle: function (id, style) {
            var layer = this._layers[id];
            if (typeof style === "function") {
                style = style(layer.feature)
            }
            if (layer.setStyle) {
                layer.setStyle(style)
            }
            return this
        }, eachFeature: function (fn, context) {
            for (var i in this._layers) {
                fn.call(context, this._layers[i])
            }
            return this
        }, getFeature: function (id) {
            return this._layers[id]
        }, bringToBack: function () {
            this.eachFeature(function (layer) {
                if (layer.bringToBack) {
                    layer.bringToBack()
                }
            })
        }, bringToFront: function () {
            this.eachFeature(function (layer) {
                if (layer.bringToFront) {
                    layer.bringToFront()
                }
            })
        }, redraw: function (id) {
            if (id) {
                this._redraw(id)
            }
            return this
        }, _redraw: function (id) {
            var layer = this._layers[id];
            var geojson = layer.feature;
            if (layer && layer.setIcon && this.options.pointToLayer) {
                if (this.options.pointToLayer) {
                    var getIcon = this.options.pointToLayer(geojson, L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
                    var updatedIcon = getIcon.options.icon;
                    layer.setIcon(updatedIcon)
                }
            }
            if (layer && layer.setStyle && this.options.pointToLayer) {
                var getStyle = this.options.pointToLayer(geojson, L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]));
                var updatedStyle = getStyle.options;
                this.setFeatureStyle(geojson.id, updatedStyle)
            }
            if (layer && layer.setStyle && this.options.style) {
                this.resetStyle(geojson.id)
            }
        }});
    function featureLayer(options) {
        return new exports.FeatureLayer(options)
    }
    exports.VERSION = "2.0.0-beta.4";
    exports.post = xmlHttpPost;
    exports.request = request;
    exports.task = task;
    exports.query = query;
    exports.find = find;
    exports.identify = identify;
    exports.identifyFeatures = identifyFeatures;
    exports.identifyImage = identifyImage;
    exports.service = service;
    exports.mapService = mapService;
    exports.imageService = imageService;
    exports.featureLayerService = featureLayerService;
    exports.basemapLayer = basemapLayer;
    exports.tiledMapLayer = tiledMapLayer;
    exports.imageMapLayer = imageMapLayer;
    exports.dynamicMapLayer = dynamicMapLayer;
    exports.featureLayer = featureLayer
});
//# sourceMappingURL=./esri-leaflet.js.map