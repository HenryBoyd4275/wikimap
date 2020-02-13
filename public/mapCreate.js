//global map vars
let map;
let editMode = false;
let currentMap;
//used for storing map marker info
let markers = {};
let markers_count = 0;

$("document").ready(function() {
  currentMap = 1;
  mapSetup();

  $.ajax({
    url: `/maps/initalmap`,
    type: "GET"
  }).then(response => {
    for (point of response) {
      createMarker(point);
    }
  });
  $("#edit").on("click", function() {
    editMode = true;
  });

  $("#favourite").on("click", function() {
    console.log("hello");
    console.log(currentMap);

    $.ajax({
      url: "/maps/favourite",
      type: "POST",
      data: { currentMap }
    })
      .then(console.log("Hello2"))
      .catch(error => console.log(error));
  });

  $("#save").on("click", function() {
    savePoints();
    editMode = false;
  });

  $("#eat").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",
      data: {mapId:2}
    }).then(response => {
      currentMap = response[0].map_id;
      mapSetup(); //reloads the map, clearing the markers
      for (element of response) {
        createMarker(element);
      }
    });
  });
  $("#shop").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",
      data: {mapId:3}
    }).then(response => {
      currentMap = response[0].map_id;
      mapSetup(); //reloads the map, clearing the markers
      for (element of response) {
        createMarker(element);
      }
    });
  });

  $("#play").on("click", function() {
    editMode = false;
    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",
      data: {mapId:4}
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
    mapTitle = $(".title-box").val();

    $(".map-name").slideUp("slow");
    editMode = true;
    mapTitle = $(".title-box").val();
    $.ajax({
      url: "/maps/new",
      type: "POST",
      data: { title: mapTitle }
    })
      .then(response => {
        currentMap = response.id;
      })
      .then(() => {
        mapSetup();
      });
  });

  $("#new_map").on("click", function() {
    $(".map-name").slideDown("slow");
    $(".title-box").focus();
  });
});
