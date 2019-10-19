
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
            {layer: new WorldWind.CompassLayer(), enabled: false},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a surface image using a static image.
        var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(51.4957591, 51.4957591+0.1,31.1675, 31.1675+0.1),
            "https://earthengine.googleapis.com/api/thumb?thumbid=4f51eac6fc30d98eaae221d0f4bce767&token=e449468fb766605ad9f301b9d6106c50");

        // Create a surface image using a static image and apply filtering to it.
        var surfaceImage2 = new WorldWind.SurfaceImage(new WorldWind.Sector(50, 60, -80, -60),
            "data/surface-image-nearest.png");
        surfaceImage2.resamplingMode = WorldWind.FILTER_NEAREST; // or FILTER_LINEAR by default

        // Create a surface image using a dynamically created image with a 2D canvas.

        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2 - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        var surfaceImage3 = new WorldWind.SurfaceImage(new WorldWind.Sector(30, 40, -100, -80),
            new WorldWind.ImageSource(canvas));

        // Add the surface images to a layer and the layer to the WorldWindow's layer list.
        var surfaceImageLayer = new WorldWind.RenderableLayer();
        surfaceImageLayer.displayName = "Surface Images";
        surfaceImageLayer.addRenderable(surfaceImage1);
        surfaceImageLayer.addRenderable(surfaceImage2);
        surfaceImageLayer.addRenderable(surfaceImage3);


        var handlePick = function (o) {
            var x = o.clientX,
                y = o.clientY;

            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

            let position;
            var objPosition = pickList.objects;

            if(objPosition[0].position === null) {
                position = objPosition[1].position;
            }else{
                position = objPosition[0].position;
            }
            let latitude = position.latitude;
            let longitude = position.longitude;

            let  daylist = getDaysArray("2017-01-01","2018-07-01");

            for(let i = 0;i < daylist.length;i++){
                // console.log(item);
                setTimeout(()=>{
                    imageApi(longitude,latitude,0.1,daylist[i]);
                    console.log(daylist[i])

                },i * 1000)

            };




        };
        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("click", handlePick);


        wwd.addLayer(surfaceImageLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });
function imageApi(lon = 31.2204991,lat = 51.4957591,dim = 0.1,date = '2014-02-01'){
    const api_key = "oVd1eisXLEf4XceyUT9goPsGECkU2xqgXjxJMAHs";
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
            console.log(data);
            let url = data.url;
           $('.container-image').append('<img src="'+url+'"><br><br>');
        }

    });
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
