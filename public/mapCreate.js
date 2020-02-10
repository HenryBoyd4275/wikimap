let map; //global variable
let editMode = false;

$("document").ready(function() {
  initMap();
  addRemoveListeners();

  $("#edit").on("click", function() {
    console.log('edit button')
    editMode = true;
  });

  $("#save").on("click", function() {
    editMode = false;
  });

  $("#eat").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/query`,
      type: "GET"
    }).then(response => {
      initMap(); //reloads the map, clearing the markers
      addRemoveListeners();

      for (element of response) {
        createMarker(element);
      }
    });
  });
});

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

function createMarker(coords) {
  let marker = new google.maps.Marker({
    position: coords,
    map: map
  });

  let info = new google.maps.InfoWindow({
    content: `<h4>${coords.title}</h4>
                  <h6>${coords.description}</h6>
                  `
  });

  marker.addListener("click", function() {
    info.open(map, marker);
  });

  map.addListener("click", function(event) {
    info.close(map, marker);
  });
}


function addRemoveListeners(action) {
  const addHandler = function(event) {
    if (editMode) {
      createMarker(event.latLng);
    }
  };

  map.addListener("click", addHandler);
}
