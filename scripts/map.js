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

    return {
        initMap: function () {
            var that = this;
            document.getElementById("search").addEventListener("click", function () {
                that.calculateAndDisplayRoute();
            });
        },
        calculateAndDisplayRoute: function () {
            document.getElementById("search").addEventListener("click", function () {

            // Retrieve the start and end locations and create a DirectionsRequest using
            // DRIVING directions.
            directionsService.route({
                origin: document.getElementById('from').value,
                destination: document.getElementById('to').value,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {

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
                    google.maps.event.trigger(map, 'resize');

                    polyline.setMap(map);
                    map.fitBounds(bounds);


                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        });
        }
    }
}());

hiwaysCalc.initMap();
