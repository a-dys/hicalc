var hiwaysCalc = (function () {

    // Create a map and center it
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.76614013468048, lng: 19.48974609375},
        zoom: 7
    });

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;
    var polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#FF0000',
        strokeWeight: 6
    });
    var polylineAlt = new google.maps.Polyline({
        path: [],
        strokeColor: '#A0A0A0',
        strokeWeight: 6
    });
    var markers = [];

    var coordinatesA2 = {"coords":[
        {"name": "swiecko", "lat":"52.334853", "lng":"14.903534"},
        {"name": "torzym", "lat":"52.322850", "lng":"15.083333"},
        {"name": "jordanowo", "lat":"52.321175", "lng":"15.546186"},
        {"name": "trzciel", "lat":"52.331853", "lng":"15.871153"},
        {"name": "nowy_tomysl", "lat":"52.361509", "lng":"16.099666"},
        {"name": "buk", "lat":"52.378239", "lng":"16.568509"},
        {"name": "goluski", "lat":"52.350504", "lng":"16.731853"},
        {"name": "poznan_wschod", "lat":"52.310710", "lng":"17.151247"},
        {"name": "slupca", "lat":"52.255474", "lng":"17.823074"},
        {"name": "ladek", "lat":"52.221718", "lng":"17.951374"},
        {"name": "konin", "lat":"52.152454", "lng":"18.277833"},
        {"name": "kolo", "lat":"52.138743", "lng":"18.608184"},
        {"name": "dabie", "lat":"52.070408", "lng":"18.819342"},
        {"name": "wartkowice", "lat":"51.995389", "lng":"19.043974"},
        {"name": "emilia", "lat":"51.920450", "lng":"19.354263"},
        {"name": "zgierz", "lat":"51.909666", "lng":"19.435241"},
        {"name": "strykow", "lat":"51.892861", "lng":"19.558388"}
    ]};


    return {
        initMap: function () {
            var that = this;
            document.getElementById("form").addEventListener("submit", function (e) {
                e.preventDefault();
                that.calculateAndDisplayRoute();
                that.calculateAndDisplayAltRoute();
            });
        },

        calculateAndDisplayRoute: function () {
            var that = this;
            // Retrieve the start and end locations and create a DirectionsRequest using
            // DRIVING directions.
            directionsService.route({
                origin: document.getElementById('from').value,
                destination: document.getElementById('to').value,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                that.showInfo(response);

                if (status === google.maps.DirectionsStatus.OK) {

                    polyline.setPath([]);

                    var bounds = new google.maps.LatLngBounds();

                    var legs = response.routes[0].legs;
                    for (i = 0; i < legs.length; i++) {
                        var steps = legs[i].steps;
                        for (j = 0; j < steps.length; j++) {
                            var nextSegment = steps[j].path;
                            for (k = 0; k < nextSegment.length; k++) {
                                polyline.getPath().push(nextSegment[k]);
                                bounds.extend(nextSegment[k]);
                            }
                        }
                    }

                    polyline.setMap(map);
                    map.fitBounds(bounds);

                    that.displayRamps();

                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        },
        calculateAndDisplayAltRoute: function () {
            var that = this;
            directionsService.route({
                origin: document.getElementById('from').value,
                destination: document.getElementById('to').value,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidHighways: true
            }, function (response, status) {
                that.showAltInfo(response);

                if (status === google.maps.DirectionsStatus.OK) {

                    polylineAlt.setPath([]);

                    var bounds = new google.maps.LatLngBounds();

                    var legs = response.routes[0].legs;
                    for (i = 0; i < legs.length; i++) {
                        var steps = legs[i].steps;
                        for (j = 0; j < steps.length; j++) {
                            var nextSegment = steps[j].path;
                            for (k = 0; k < nextSegment.length; k++) {
                                polylineAlt.getPath().push(nextSegment[k]);
                                bounds.extend(nextSegment[k]);
                            }
                        }
                    }

                    polylineAlt.setMap(map);
                    map.fitBounds(bounds);

                    that.displayRamps();

                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        },

        displayRamps: function () {

            this.removeMarkers();

            var coordsA2 = coordinatesA2.coords;
            for (var i = 0; i < coordsA2.length; i++) {
                var obj = coordsA2[i];
                for (var key in obj) {
                    var rampPosLat = obj["lat"];
                    var rampPosLng = obj["lng"];
                    var rampPos = new google.maps.LatLng(rampPosLat, rampPosLng);
                    if (google.maps.geometry.poly.isLocationOnEdge(rampPos, polyline, 0.005)) {
                        var marker = new google.maps.Marker({
                            position: rampPos,
                            map: map,
                            title: obj["name"]
                        });
                        markers.push(marker);
                    }
                }
            }
        },
        getJSON: function(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "json";
            xhr.onload = function() {
                var status = xhr.status;
                if (status == 200) {
                    callback(null, xhr.response);
                } else {
                    callback(status);
                }
            };
            xhr.send();
        },
        removeMarkers : function() {
            for (i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        },
        showInfo : function(response) {
            document.getElementById("tripLength").textContent = response.routes[0].legs[0].duration.text;
            document.getElementById("tripTime").textContent = response.routes[0].legs[0].distance.text;
        },
        showAltInfo : function(response) {
            document.getElementById("tripAltLength").textContent = response.routes[0].legs[0].duration.text;
            document.getElementById("tripAltTime").textContent = response.routes[0].legs[0].distance.text;
        }
    }
}());

hiwaysCalc.initMap();
