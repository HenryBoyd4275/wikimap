
let toronto = { lat: 43.6442, lng: -79.4022 };

//Function that consolidates map setup functions
let mapSetup = function() {
  markers = {};
  markers_count = 0;
  console.log("3cMap in setup: ", currentMap);
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
  let markerArray = Object.values(markers).map(m => ({
    lat: m.position.lat(),
    lng: m.position.lng(),
    title: m.title,
    description: m.description,
    image_url: m.imgURL
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
  let options = {
    zoom: 10,
    center: toronto,
    styles: darkMode
  };

  //creates map
  map = new google.maps.Map(document.getElementById("map"), options);

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}

//creates a new marker when suer is in edit mode and map is clicked
function createMarker(coords) {
  let marker = new google.maps.Marker({
    position: coords,
    map: map
  });

  marker_id = markers_count;
  markers_count++;
  markers[marker_id] = marker;

  //default assign databse values to title/description/URL
  //new points with added values will overwrite this in textFields()
  markers[marker_id].title = coords.title;
  markers[marker_id].description = coords.description;
  markers[marker_id].imgURL = coords.image_url;

  //slight of hand that lets us edit the description if there isn't one
  let info = new google.maps.InfoWindow({
    content: `${
      !(coords.title || coords.description || coords.image_url)
        ? `
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
      <div class='info-title'><h6>${coords.title}</h6></div>
      <div class='desc-img'>
      <h8>${coords.description}</h8>
      <img src="${coords.image_url}" alt="no img" height="45" width="52">
      </div></div>
      <br>
      <button onClick="deletePoint(${marker_id})" type="button" form="delete" value="Submit" class='submit'>Delete</button>


      <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit</button>`
    }
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
function textFields(event, marker_id) {
  event.preventDefault();
  let formValues = $(event.target).serializeArray();

  let formValueArr = [];
  formValueArr.push(formValues[0].value);
  formValueArr.push(formValues[1].value);
  formValueArr.push(formValues[2].value);


  markers[marker_id].title = formValues[0].value;
  markers[marker_id].description = formValues[1].value;
  markers[marker_id].imgURL = formValues[2].value;

  console.log(markers)

  $(event.target).replaceWith(insertFormHTML(formValueArr, marker_id));
}

//inserts form field data
function insertFormHTML(arr, marker_id) {
  const htmlInsert = `<div class='info-box'>
  <div class='info-title'><h6>${arr[0]}</h6></div>
  <div class='desc-img'>
  <span class='desc'><p>${arr[1]}</p></span>
  <img src="${arr[2]}" alt="no img" height="52" width="52">
  </div><br>
  <button onClick="deletePoint(${marker_id})" type="submit" form="form1" value="Submit" class='submit'>Deletes</button>
  <button onClick="insertTextFields(event)" type="button" form="delete" value="Submit" class='submit'>Edit</button>
  `;
  return htmlInsert;
}

function insertTextFields(events) {
  const htmlTextFields = `
  <div class='description'>
  <form onSubmit="return textFields(event,${marker_id})" id="form1">
  Title: <input type="text" name="title" class='title'><br><br>
  Description: <input type="text" name="description"><br>
  ImgUrl: <input type="text" name="imgURL"><br>


  <button type="submit" form="form1" value="Submit" class='submit'>Submit</button>


  </form> <br>
  </div>
  `;

  $(events.target)
    .parent()
    .parent()
    .replaceWith(htmlTextFields);
}

function deletePoint(marker_id) {
  markers[marker_id].setMap(null);
  delete markers[marker_id];
}



function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    map.setCenter(toronto);
  });

}


const darkMode=[
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
]
