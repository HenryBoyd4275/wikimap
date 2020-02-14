
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
    for (let point of response) {
      createMarker(point);
    }
  });

  $("#edit").on("click", function() {
    editMode = true;

  });


  $("#favourite").on("click", function() {
    $.ajax({
      url: "/maps/favourite",
      type: "POST",
      data: { currentMap }
    })
    .then((response) => {
      $("#dropdownmenufav").append(`<button class="dropdown-item" name="favMaps" onclick="redirectByMapID(${currentMap})" > ${response} </button>`)

    })
    .catch(error => console.log(error))
  })


  $("#save").on("click", function() {
    if(Object.keys(markers).length===0){

      window.alert("Please Add A Point before Saving.");

    } else{
    savePoints();
    editMode = false;
    }
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

        $("#dropdownmenuowned").append(`<button class="dropdown-item" name="favMaps" onclick="redirectByMapID(${response.id})" > ${mapTitle} </button>`)

        $("#dropdownmenuall").append(`<button class="dropdown-item" name="favMaps" onclick="redirectByMapID(${response.id})" > ${mapTitle} </button>`)

      })
      .then(() => {
        mapSetup();
      });
  });

  $("#new_map").on("click", function() {
    $(".map-name").slideDown("slow");
    $(".title-box").focus();
  });

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("edit");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btn.onclick = function() {
  modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
  modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
});

