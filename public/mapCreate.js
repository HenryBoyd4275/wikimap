//global map vars
let map;
let editMode = false;
let currentMap;
//used for storing map marker info
let markers = {};
let markers_count = 0;


$("document").ready(function() {

  $(".edit-mode").hide()
  $(".empty-div").hide()

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
    $(".edit-mode").show()
    $(".empty-div").show()
  });

  $("#favourite").on("click", function() {

    $.ajax({
      url: "/maps/favourite",
      type: "POST",
      data: { currentMap }
    })
    .then((response) => {
      $("#dropdownmenufav").append(`<button class="dropdown-item" name="favMaps" onclick="testFunction(${currentMap})" > ${response} </button>`)

    })
    .catch(error => console.log(error))
  })

  $("#save").on("click", function() {
    savePoints();
    editMode = false;
    $(".edit-mode").hide()
    $(".empty-div").hide()
  });

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

  $(".title-box").keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  })

  $("#new_map").on("click", function() {
    $(".map-name-bar").slideDown('slow', function() {
      // Animation complete.
    });
    editMode = true;
  });



  $("#shop").on("click", function() {
    editMode = false;

    $.ajax({
      url: `/maps/queryPoints`,
      type: "POST",
      data: {map:3}
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
      data: {map:4}
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

