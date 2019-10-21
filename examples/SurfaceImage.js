
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }


        var handlePick = function (o) {
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }
            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                var numShapesPicked = 0;
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);
                    let check = false;

                    try{
                        let   test = pickList.objects[p].userObject.attributes.dataJson;
                    }catch(e){


                    if (pickList.objects[p].isTerrain) {
                        let position;
                        var objPosition = pickList.objects;

                        if (objPosition[0].position === null) {
                            position = objPosition[1].position;
                        } else {
                            position = objPosition[0].position;
                        }
                        let latitude = position.latitude;
                        let longitude = position.longitude;

                        let daylist = getDaysArray("2015-01-01", "2016-01-01");

                        for (let i = 0; i < daylist.length; i++) {
                            // console.log(item);
                            setTimeout(() => {
                                $.magnificPopup.open({
                                    items: {
                                        src: '<div class="white-popup"></div>',
                                        type: 'inline'
                                    }
                                });
                                console.log(1);
                                imageApi(longitude, latitude, 0.1, daylist[i]);

                            }, i * 1)

                        }
                        ;

                    }
                    }
                }
            }




        };
        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("contextmenu", handlePick);

        var pinLibrary = WorldWind.WWUtil.currentUrlSansFilePart() + "/../images/pushpins/", // location of the image files
            placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            latitude = 47.684444,
            longitude = -121.129722;

        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;


        // Tell the WorldWindow that we want deep picking.
        wwd.deepPicking = true;

        // Now set up to handle picking.
        var highlightedItems = [];

        // The common pick-handling function.
        var handlePick2 = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                var numShapesPicked = 0;
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);


                    // Increment the number of items picked if a shape is picked.
                    if (!pickList.objects[p].isTerrain) {
                        ++numShapesPicked;
                        let data = pickList.objects[p].userObject.attributes.dataJson;
                        let  daylist = getDaysArray("2015-01-01","2016-01-01");

                        for(let i = 0;i < daylist.length;i++){

                                $.magnificPopup.open({
                                    items: {
                                        src: '<div class="white-popup"></div>',
                                        type: 'inline'
                                    }
                                });


                        };
                        alert(data.name+"<br>"+data.description);


                    }
                }


            }


            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("contextmenu", handlePick2);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        // Define the images we'll use for the placemarks.
        var images = [
            "plain-black.png",
            "plain-blue.png",
            "plain-brown.png",
        ];

        let dataDisasters;
        let array = [];

        dataDisasters = getApiDisasters();

        for (var i = 0, len = dataDisasters.length; i < len; i++) {
            // Create the placemark and its label.
            let location = dataDisasters[i].data[0].fields.country[0].location;
            let name = dataDisasters[i].data[0].fields.name;
            let description = dataDisasters[i].data[0].fields.description;
            placemark = new WorldWind.Placemark(new WorldWind.Position(location.lat, location.lon, 1e2), false, null);
            placemark.label = name + "\n"
                + "Lat " + latitude.toPrecision(4).toString() +
                + "Lon " + longitude.toPrecision(5).toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = pinLibrary + images[1];
            placemark.attributes = placemarkAttributes;
            placemarkAttributes.dataJson = dataDisasters[i].data[0].fields;
            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
        }

        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);


        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });


function imageApi(lon = 31.2204991,lat = 51.4957591,dim = 0.1,date = '2014-02-01'){
    const api_key = "posBKuPZMMULsLORbNdlOW0DMG9Y19VmAUNgUFU9";
    let url = 'https://api.nasa.gov/planetary/earth/imagery/';
    $.ajax({
        type:'GET',
        data:{
            lon:lon,
            lat:lat,
            dim:dim,
            date:date,
            api_key:api_key
        },
        dataType:'json',
        url: url,
        success: function (data) {
            let url = data.url;
            let date = data.date;
           $('.white-popup').append('<img src="'+url+'">'+date+'<br><br>');
        }
    });
}

function getApiDisasters(){

   let data = $.ajax({
        type:'GET',
        dataType:'json',
       async: false,
       url: '/WebWorldWind/examples/dataDisasters.html',
        done: function (data) {
            return data;
        }
    }).responseJSON;

   return data;
}


function getDaysArray(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    for(var arr=[],dt=start; dt<=end; dt.setMonth(dt.getMonth()+1)){
        let date = new Date(dt);
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + '-' + mm + '-' + dd;

        arr.push(today);
    }
    return arr;
};
