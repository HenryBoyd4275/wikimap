$('document').ready(function(){
  initMap();

  // This event listener will call addMarker() when the map is clicked.
  map.addListener('click', function(event) {
    createMarker(event.latLng);
  });

  $('#eat').on("click", function() {
    //ajax request will return html, need to return JSON


    $.ajax({
      url: `/maps/query`,
      type: "GET",
    }).then(response => {
      initMap() //reloads the map thus clearing the markers

     for (element of response){
      createMarker(element)
     }

    });
});


});

let map; //global variable


  function initMap() {
    let toronto = { lat: 43.6442, lng: -79.4022 };

    let options = {
      zoom: 10,
      center: toronto
    };
    //creates map
   map = new google.maps.Map(document.getElementById("map"), options);

    let markerLHL = { lat: 43.6442, lng: -79.4022 };
    let tomsHome = { lat: 43.7756, lng: -79.2579 };

    let LHLicon = {
      url: "https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };


    }


  function createMarker(coords){
    console.log(coords, 'passed from index.ejs')
    let marker = new google.maps.Marker({
      position: coords,
      map: map });

    let info = new google.maps.InfoWindow({
        content: `<h4>${coords.title}</h4>
                  <h6>${coords.description}</h6>
                  `
      });

    marker.addListener("click", function() {
        info.open(map, marker);
    });

    map.addListener('click', function(event) {
        info.close(map, marker);
    });

  }
