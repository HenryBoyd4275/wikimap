
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
    description : m.description,
    image_url : m.imgURL
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

  //console.log(coords)

  let marker = new google.maps.Marker({
    position: coords,
    map: map,
    //img: coords.image_url
  });

  marker_id = markers_count
  markers_count++
  markers[marker_id] = marker

  //default assign databse values to title/description/URL
  //new points with added values will overwrite this in textFields()
  markers[marker_id].title = coords.title;
  markers[marker_id].description = coords.description;
  markers[marker_id].imgURL = coords.image_url

  //slight of hand that lets us edit the description if there isn't one
  let info = new google.maps.InfoWindow({
    content:  `${!(coords.title || coords.description || coords.image_url) ? `
    <div class='description'>
      <form onSubmit="return textFields(event,${marker_id})" id="form1">
      Title: <input type="text" name="title" class='title'><br><br>
      Description: <input type="text" name="description">
      <br><br>
      ImgUrl: <input type="text" name="imgURL">
      <br><br>
      <button type="submit" form="form1" value="Submit" class='submit'>Submit</button>

      </form> <br>
      </div>
    `
      : `<div class='info-box'>
      <h6>${coords.title}</h6>
      <div class='desc-img'>
      <h8>${coords.description}</h8>
      <img src="${coords.image_url}" alt="no img" height="45" width="52">
      </div></div>
      <br>
      <button onClick="deletePoint(${marker_id})" type="button" form="delete" value="Submit" class='submit'>Delete</button>

      <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit</button>` }
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
  markers[marker_id].imgURL = formValues[2].value

  $(event.target).replaceWith(insertFormHTML(formValueArr, marker_id))
}

//inserts form field data
function insertFormHTML(arr, marker_id){
  const htmlInsert=`<div class='info-box'>
  <h6>${arr[0]}</h6>
  <div class='desc-img'>
  <span class='desc'><p>${arr[1]}</p></span>
  <img src="${arr[2]}" alt="no img" height="52" width="52">
  </div><br>
  <button onClick="deletePoint(${marker_id})" type="submit" form="form1" value="Submit" class='submit'>Deletes</button>
  <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit</button>
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
