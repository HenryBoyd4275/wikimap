let map; //global variable
let editMode = false;
let newMarkers = [];
let deleteMarkers = [];
let currentMap;

let markers = {}
let markers_count = 0


$("document").ready(function() {
let mapSetup = function () {
  initMap();
  addRemoveListeners();
  newMarkers = [];
  deleteMarkers = [];
}

$("document").ready(function() {
  mapSetup();
  currentMap = 1;
  // $.ajax({
  //   url: `/`,
  //   type: 'GET',
  //   data: {mapID: 1}
  // }).then(console.log("after ajax post"));

  $("#edit").on("click", function() {
    console.log('edit button')
    editMode = true;
  });

  $("#save").on("click", function() {
    //I need the current map ID
    $.ajax({
      url: `/maps/save`,
      type: "POST",
      data: {markers: newMarkers,
      currentMap} //add the current map id from above request here
    }).then()
    editMode = false;
  });

  $("#eat").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/queryPoints`,
      type: "GET"
    }).then(response => {
      mapSetup(); //reloads the map, clearing the markers
      currentMap = response[0].map_id;
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
    map: map,

  });

  marker_id = markers_count
  markers_count++
  markers[marker_id] = marker

  let info = new google.maps.InfoWindow({
    content:  `${!(coords.title) ? `
    <div class='description'>
      <form onSubmit="return textFields(event, ${marker_id})" id="form1">
      Title: <input type="text" name="title" class='title'><br><br>
      Description: <input type="text" name="description"><br>

      <button type="submit" form="form1" value="Submit" class='submit'>Submit</button>

      </form> <br>
      </div>

    `
      : `
      <h4>${coords.title}</h4> <h6>${coords.description}</h6><button onClick="deletePoint(${marker_id})" type="button" form="delete" value="Submit" class='submit'>Delete</button>` }

      `

  });

  info.marker = marker;



  marker.addListener("click", function() {
    console.log(info, 'info.open')
    info.open(map, marker);
  });

  map.addListener("click", function(event) {
    info.close(map, marker);
  });

}

function addRemoveListeners(action) {
  const addHandler = function(event) {
    if (editMode) {
      newMarkers.push({
        lat : event.latLng.lat(),
        lng : event.latLng.lng(),
        //description
        //title
      });
      createMarker(event.latLng);
      console.log("markers", newMarkers);
    }
  };

  map.addListener("click", addHandler);
}

function textFields(event,marker_id){
  event.preventDefault();
  let formValues=$(event.target).serializeArray()

  let formValueArr=[]
  formValueArr.push(formValues[0].value)
  formValueArr.push(formValues[1].value)

  markers[marker_id].title = formValues[0].value
  markers[marker_id].description = formValues[1].value

  $(event.target).replaceWith(insertHTML(formValueArr, marker_id))
  console.log(markers, 'new markers')
}


function insertHTML(arr, marker_id){
  const htmlInsert=`
  <h4>${arr[0]}</h4> <h6>${arr[1]}</h6>
  <button onClick="deletePoint(${marker_id})" type="submit" form="form1" value="Submit" class='submit'>Deletess</button>
  `
  return htmlInsert;
}


function deletePoint(marker_id){

  markers[marker_id].setMap(null);

}
