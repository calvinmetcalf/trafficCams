var m;
var zoom = 8;
var center = new google.maps.LatLng(42.04113400940814,-71.795654296875);
var xUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fwww1.eot.state.ma.us%2Fxmltrafficfeed%2FcamsXML.aspx%22&format=json";
var infowindow = new google.maps.InfoWindow();
$(function() {
   
    map();
    
});

  function map(){
            m = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom,
      mapTypeId: 'roadmap'
    });
    $.get(xUrl,
            function(data)
            {
                var cams = data.query.results.TrafficCams.Cam,static1,static2;
                $.each(cams,
                function(i,cam)
                        {
                        var iconImage,content;
                        
                        if(cam.active == "false"){
                            iconImage = "http://chart.googleapis.com/chart?chst=d_map_xpin_letter_withshadow&chld=pin|X|FF0000|000000";
                            content = 'sorry no image'
                        }
                        else if(cam.active == "true"){
                            if(cam.static1_img[0] == "~")
                            {static1 = "http://www1.eot.state.ma.us" + cam.static1_img.slice(1)}
                            else {static1 = cam.static1_img}
                             if(cam.static2_img[0] == "~")
                            {static2 = "http://www1.eot.state.ma.us" + cam.static2_img.slice(1)}
                            else {static2 = cam.static2_img}
                        iconImage = "https://chart.googleapis.com/chart?chst=d_map_xpin_icon_withshadow&chld=pin|glyphish_camera|52B552";
                        content = '<div id="tabs"><ul><li><a href="#tabs-1">Image</a></li><li><a href="#tabs-2">' + cam.static1_direction + ' reference image</a></li><li><a href="#tabs-3">' + cam.static2_direction + ' reference image</a></li></ul><div id="tabs-1"><img src="' + cam.image + '"/></div><div id="tabs-2"><img src="' + static1+ '"/></div><div id="tabs-3"><img src="' + static2 + '"/></div></div>';
                        }
                    var  marker = new google.maps.Marker({
                     position:  new google.maps.LatLng(cam.lat, cam.long),
                     map: m,
    				icon: new google.maps.MarkerImage(iconImage),   
                   title: cam.name
                          //  shape
                    });
                     google.maps.event.addListener(marker, 'click',
        					function()
							{
                                infowindow.setContent(content);
                              infowindow.open(m,marker);
                             
							});
    				}
                    );
                },"jsonp"
    )
    google.maps.event.addListener(infowindow, 'domready', function() {
      $("#tabs").tabs();
    });
  }