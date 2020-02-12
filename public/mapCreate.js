let map; //global variable
let editMode = false;
let currentMap;
let markers = {}
let markers_count = 0


let mapSetup = function () {
  initMap();
  addRemoveListeners();
  markers = {}
  markers_mapSetupcount = 0
}

$("document").ready(function() {

  mapSetup();
  currentMap = 1;

  $("#edit").on("click", function() {
    console.log('edit button')
    editMode = true;
  });

  $("#save").on("click", function() {
    let markerArray = Object.values(markers).map( m => ({
      lat : m.position.lat(),
      lng : m.position.lng(),
      title : m.title,
      description : m.description
    }));
    $.ajax({
      url: `/maps/save`,
      type: "POST",
      data: {
        markerArray,
        currentMap
      }
    }).then( response => {
      console.log("end");
    })
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

  $("#submit-map").on("click", function(e) {
    e.preventDefault();
    mapTitle=$(".title-box").val()
    console.log(mapTitle)
  });

  $("#new_map").on("click", function() {

    editMode = true;
    $.ajax({
      url:"/maps/new",
      type: "POST",
      data:{title:'NEWNEWMAP'}
    }).then(response => {
      console.log('taafssadf')
      mapSetup()
    });


    $(".map-name").slideDown("slow");
    $(".title-box").focus();
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

  //default assign databse values to title/description
  //new points with added title/desc will overwrite this in textFields()
  markers[marker_id].title = coords.title;
  markers[marker_id].description = coords.description;

  let info = new google.maps.InfoWindow({
    content:  `${!(coords.title) ? `
    <div class='description'>
      <form onSubmit="return textFields(event,${marker_id})" id="form1">
      Title: <input type="text" name="title" class='title'><br><br>
      Description: <input type="text" name="description"><br>
      ImgUrl: <input type="text" name="imgURL"><br>

      <button type="submit" form="form1" value="Submit" class='submit'>Submit</button>


      </form> <br>
      </div>
    `
      : `
      <h6>${coords.title}</h6> <h8>${coords.description}</h8>
      <img src="${coords.image_url}" height="52" width="52">
      <br>
      <button onClick="deletePoint(${marker_id})" type="button" form="delete" value="Submit" class='submit'>Delete</button>

      <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit no work =(</button>` }
      `
  });

  info.marker = marker;

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

function textFields(event,marker_id){
  event.preventDefault();
  let formValues=$(event.target).serializeArray()

  let formValueArr=[]
  formValueArr.push(formValues[0].value)
  formValueArr.push(formValues[1].value)
  formValueArr.push(formValues[2].value)

  markers[marker_id].title = formValues[0].value
  markers[marker_id].description = formValues[1].value
  markers[marker_id].imgURL = formValues[1].value

  $(event.target).replaceWith(insertHTML(formValueArr, marker_id))
  console.log(markers, 'new markers')
}


function insertHTML(arr, marker_id){
  const htmlInsert=`
  <h6>${arr[0]}</h6> <h8>${arr[1]}</h8>
  <img src="${arr[2]}" height="52" width="52">
  <br>
  <button onClick="deletePoint(${marker_id})" type="submit" form="form1" value="Submit" class='submit'>Deletess</button>
  <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit no work =(</button>
  `
  return htmlInsert;
}

function insertTextFields(events){
  const htmlTextFields=`
  <div class='description'>
  <form onSubmit="return textFields(event,${marker_id})" id="form1">
  Title: <input type="text" name="title" class='title'><br><br>
  Description: <input type="text" name="description"><br>
  ImgUrl: <input type="text" name="imgURL"><br>


  <button type="submit" form="form1" value="Submit" class='submit'>Submit</button>


  </form> <br>
  </div>

  `

  $(events.target).parent().parent().replaceWith(htmlTextFields)
}

function deletePoint(marker_id){
  markers[marker_id].setMap(null);
  delete markers[marker_id];
}

function editPoint(marker_id){

}
