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

// create the function for the initial data rendering
function init() {

    resetData();

    // read the data 
    d3.json("samples.json").then((data) => {
        var idArray = data.names;
        // append id data to the dropdwown menu
        for (var i = 0; i < idArray.length; i++) {
            dropDownMenu.append("option").text(idArray[i]).property("value");
        };

        // call the functions to display the data and the plots to the page
        // buildPlot(data.names[0]);
        // getData(data.names[0]);
    });
}

init();