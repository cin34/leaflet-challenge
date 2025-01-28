// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
  {
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      stroke: true,
      fillOpacity: 0.9,
      color: "black",
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag)
  };
}
  


  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
      if (depth < 10 && depth >= -10) return "green";
      else if (depth < 30 && depth >= 10) return "greenyellow";
      else if (depth < 50 && depth >= 30) return "yellow";
      else if (depth < 70 && depth >= 50) return "orange";
      else if (depth < 90 && depth >= 70) return "orangered";
      else return "red";
  }
 

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return Math.sqrt(magnitude) * 10;
    }

  

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {


    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);


    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,


    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>(M)agnitude - Location:<br>" + feature.properties.title + "<br><h3>Depth:<br>" + feature.geometry.coordinates[2]);
    }

  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = ["green", "greenyellow", "yellow", "orange", "orangered", "red"];


    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
          "<i style='background:" + colors[i] + "'></i> " +
          depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
  
    }
    return div;
  };

  // Finally, add the legend to the map.
    legend.addTo(map);

});



