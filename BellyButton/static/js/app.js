// select the user input field
var dropDownMenu = d3.select("#selDataset");

// select the metadata div
var demographTable = d3.select("#sample-metadata");

// select the bar chart div
var barChart = d3.select("#bar");

// select the bubble chart div
var bubbleChart = d3.select("#bubble");

// select the gauge chart div
var gaugeChart = d3.select("#gauge");

/**
 * Helper function to select data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 */

function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

// Create the function for the initial data rendering
function init() {

    // Read the json file to get data
    d3.json("data/samples.json").then(function(data) {

        var idNumber = data.names;
        
        // Append id data to the dropdwown menu
        for (var i = 0; i < idNumber.length; i++) {
            dropDownMenu.append("option").text(unpack(idNumber, i)).property("value", unpack(idNumber, i));
        };

        // Call the functions to display the data and the plots to the page
        buildPlot(data.names[0]);
        getData(data.names[0]);
    });
}

// Create the function for the change event
function optionChanged(id) {
    buildPlot(id);
    getData(id);
}


// Create the function to get the metadata
function getData(id) {
    // Read the json file to get data
    d3.json("data/samples.json").then((data) => {

        // Empty the demographic table each time before getting new id info
        demographTable.html("");
        
        // Get the metadata for the demographic table
        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];

        console.log(result);

        // Iterate through each key and value in the metadata
        Object.entries(result).forEach(([key, value]) => {
            demographTable.append("h5").text(`${key}:${value}`);

        });
    });
}


init();