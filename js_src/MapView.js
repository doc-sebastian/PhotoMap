'use strict'

/**
 * PhotoMap
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Piotr Bator <prbator@gmail.com>
 * @copyright Piotr Bator 2017
 */

export default class MapView {

    TRACK_COLORS_ARRAY = ['#3772FF', '#3BB273', '#E1BC29', '#7768AE', '#AC3931'];

    constructor(app) {
        this.app = app;
        this.initMap();
        this.initEventListeners();
    }

    initMap() {
        //Create a map
        var map = L.map('map', { maxZoom: 18});
        
        //Add Background Mapping
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ''
			//'<a href="GISforThought.com">GISforThought</a> | <a href="http://blog.thematicmapping.org/2014/08/showing-geotagged-photos-on-leaflet-map.html">Leaflet.Photo</a> | Base map data &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //Create the photolayer
        var photoLayer = L.photo.cluster({ spiderfyDistanceMultiplier: 1.2 }).on('click', function (evt) {
            evt.layer.bindPopup(L.Util.template('<a href="{rawurl}" target="_blank"><img src="{url}" height="auto" width="100%"/></a>', evt.layer.photo), {
                className: 'leaflet-popup-photo',
                minWidth: 400
            }).openPopup();
        });

        this.map = map;
        this.layer = photoLayer;
        this.trackLayer = L.layerGroup([]);
        this.trackLayer.addTo(map);
    }

    initEventListeners() {
        var onMapMoveEnd = (function(_app){
            return function () {
                _app.onMapsBoundMoved();
            }
        }) (this.app);
        this.map.on('moveend', onMapMoveEnd);
    }

    centerMapOnPoint(lat, lng) {
        this.map.setView(new L.LatLng(lat, lng), 18);
    }

    fitBounds(swPoint, nePoint) {
        var southWest = L.latLng(swPoint[0], swPoint[1]),
            northEast = L.latLng(nePoint[0], nePoint[1]),
            bounds = L.latLngBounds(southWest, northEast);
        this.map.fitBounds(bounds);
    }

    /**
     * 
     * @param {*} images array of markers: {id, lat, lng, url, thumbnail}
     */
    showPhotoMarkers(markers) {
        this.layer
            .add(markers)
            .addTo(this.map);
        this.map.fitBounds(this.layer.getBounds());
    }

    showTrackList (tracks) {
        var i = 0;
        for (var id in tracks) {
            if (tracks.hasOwnProperty(id)) {
                this.showTrack(id, tracks[id], this.TRACK_COLORS_ARRAY[i % this.TRACK_COLORS_ARRAY.length]);
                i++;
            }
        }
    }

    getTrackIds() {
        var ids = [];
        this.trackLayer.eachLayer(function (layer) {
            ids.push(layer.trackId);
        });
        return ids;
    }

    showTrack(id, trackPoints, color) {
        var pointList = [];
        for (var i = 0; i < trackPoints.length ; i++) {
            var tPoint = trackPoints[i];
            pointList.push(new L.LatLng(tPoint.lat, tPoint.lng));
        }
        var trackPolyline = new L.Polyline(pointList, {
            color: color,
            weight: 2,
            opacity: 1,
            smoothFactor: 1
        });
        trackPolyline.trackId = id;
        trackPolyline.setText('  ►  ', {repeat: true,
            offset: 8,
            center: false,
            attributes: {
                'dy': '6',
                'fill': color,
                'font-weight': 'bold',
                'font-size': '22'}
            }
        );
        this.trackLayer.addLayer(trackPolyline);
    }

    hideTracks(ids) {
        if(ids) {
            this.trackLayer.eachLayer(function (layer) {
                if (ids.includes(layer.trackId)) {
                    this.removeLayer(layer);
                }
            }, this.trackLayer);
        } else {
            this.trackLayer.clearLayers();
        }
    }

    showFirstRunMessage() {
        var latlng = [25, 0];
        this.map.setView(latlng, 2);
        var message = "<h2>" + t('photomap', 'Es wurden noch keine Fotos hinzugefügt?') + "</h2>" +
            "<p>"+ t('photomap', 'Fügen Sie Fotos zur Cloud hinzu. Fotos mit Geodaten werden automatisch auf der Karte angezeigt.') + "</p>" +
            "<p>"+ t('photomap', 'Wenn bereits Fotodaten in die Cloud hochgeladen wurden können diese vom Administrator mit folgendem Befehl indiziert werden: {command}', {"command" : "<b>occ&nbsp;photoMap:rescanPhotos</b>"}, undefined, {escape: false}) + "</p>";
        this.showPopup(latlng, message);
    }

    showPopup(latlng, message) {
        L.popup()
        .setLatLng(latlng)
        .setContent(message)
        .openOn(this.map);
    }

    getZoomLevel() {
        return this.map.getZoom();
    }

    getBounds() {
        var bounds = this.map.getBounds();
        return [[bounds.getSouth(), bounds.getWest()],[bounds.getNorth(), bounds.getEast()]];
    }

}