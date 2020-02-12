//global map vars
let map;
let editMode = false;
let currentMap;
//used for storing map marker info
let markers = {};
let markers_count = 0;

//Function that consolidates map setup functions
let mapSetup = function () {

  markers = {};
  markers_count = 0;

  initMap();
  addListener();

  //change the title html element to match current map title
  $.ajax({
    url: `/maps/getTitle`,
    type: "POST",
    data: {currentMap}
  }).then(responce => {
    $('#Title').replaceWith(`<h1 id='Title'>${responce.rows[0].title}</h1>`)
  }).catch(error => console.log("error during title update: ", error));
}

//saves the current map points into the DB. needs to also save the map title
let savePoints = function() {
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
}

$("document").ready(function() {

  currentMap = 1;
  mapSetup();

  // Renders favourite map when clicking on Favourites dropdown
  // list item
  $(".dropdown-item").on("click", function() {
    console.log("Boo!")
    $.ajax({
      url: 'user/'
    })


    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",

    }).then(response => {
      console.log(response)
      console.log(response[1]) // is first point of a map
      currentMap = response[0].map_id;
      mapSetup(); //reloads the map, clearing the markers
      for (element of response) {
        createMarker(element);
      }
    });
  })

  $("#edit").on("click", function() {
    console.log('edit button')
    editMode = true;
  });

  $("#favourite").on("click", function() {

    $.ajax({
      url: '/maps/favourite',
      type: "POST",
      data: {currentMap}
    })
    .then(console.log("Hello2"))
    .catch(error => console.log(error))
  })

  $("#save").on("click", function() {
    savePoints();
    editMode = false;
  })

  $("#eat").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",
      data: {map: 2}
    }).then(response => {
      currentMap = response[0].map_id;
      mapSetup(); //reloads the map, clearing the markers
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

  // let LHLicon = {
  //   url: "https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png", // url
  //   scaledSize: new google.maps.Size(30, 30), // scaled size
  //   origin: new google.maps.Point(0, 0), // origin
  //   anchor: new google.maps.Point(0, 0) // anchor
  // };
};

//creates a new marker when suer is in edit mode and map is clicked
function createMarker(coords) {

  let marker = new google.maps.Marker({
    position: coords,
    map: map,
    img:coords.image_url
  });

  marker_id = markers_count
  markers_count++
  markers[marker_id] = marker

  //default assign databse values to title/description
  //new points with added title/desc will overwrite this in textFields()
  markers[marker_id].title = coords.title;
  markers[marker_id].description = coords.description;

  //slight of hand that lets us edit the description if there isn't one
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

//adds listener for click when we enter edit mode
function addListener(action) {
  const addHandler = function(event) {
    if (editMode) {
      createMarker(event.latLng);
    }
  };
  map.addListener("click", addHandler);
}

//updates marker text field data
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

  $(event.target).replaceWith(insertFormHTML(formValueArr, marker_id))
  console.log(markers, 'new markers')
}

//inserts form field data
function insertFormHTML(arr, marker_id){
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
