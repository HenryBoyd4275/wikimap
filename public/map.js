$(document).ready(function() {
  initMap();

  // addPoint({ lat: 43.6442, lng: -79.4022 })
  // addPoint({ lat: 43.7756, lng: -79.2579 })
});

function initMap() {
  let toronto = { lat: 43.6442, lng: -79.4022 };

  let options = {
    zoom: 13,
    center: toronto
  };
  //creates map
  const map = new google.maps.Map(document.getElementById("map"), options);

  let markerLHL = { lat: 43.6442, lng: -79.4022 };

  let LHLicon = {
    url: "https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  let tomsHome = { lat: 43.7756, lng: -79.2579 };

  // sets marker, positioned at toronto
  const marker = new google.maps.Marker({
    position: markerLHL,
    map: map,
    icon: LHLicon
  });

  let lhlInfo = new google.maps.InfoWindow({
    content: "<h3>Light House Labs</h3>"
  });

  marker.addListener("click", function() {
    lhlInfo.open(map, marker);
  });

  const marker2 = new google.maps.Marker({ position: tomsHome, map: map });
}


function test(){
  console.log('called from index.ejs')
}



//// add point does not currently work.

// function addPoint(coords) {
//   console.log(coords, "marker cords");
//   let LHLicon = {
//     url: "https://pngimg.com/uploads/rubber_duck/rubber_duck_PNG54.png", // url
//     scaledSize: new google.maps.Size(30, 30), // scaled size
//     origin: new google.maps.Point(0, 0), // origin
//     anchor: new google.maps.Point(0, 0) // anchor
//   };

//   // sets marker
//   const marker = new google.maps.Marker({
//     position: coords,
//     map: map,
//     icon: LHLicon
//   });
// }
