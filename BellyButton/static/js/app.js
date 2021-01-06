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
        buildPlots(data.names[0]);
        getData(data.names[0]);
    });
}

// Create the function for the change event
function optionChanged(id) {
    buildPlots(id);
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

// Create a function to plot charts
function buildPlots(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data) => {

        // Filter samples for plotting
        var sample = data.samples.filter(samp => samp.id == id)[0];

        // Create empty arrays for sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample
        Object.entries(sample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                default:
                    break;
            }

        });

        // slice and reverse the arrays to get the top 10 values, labels and IDs
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labelling y-axis
        var topOtuIdsFormat = topOtuIds.map(otuID => "OTU " + otuID);

        // PLOT BAR CHART

        // Create trace
        var barTrace = {
            x: topSampleValues,
            y: topOtuIdsFormat,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(125,145,192)'
            }
        };

        // Create data array
        var barData = [barTrace];

        // Define plot layout
        var barLayout = {
            height: 500,
            width: 500,
            hoverlabel: {
                font: {
                    family: 'Arno Pro'
                }
            },
            title: {
                text: `<b>Top OTUs for Test Subject ${id}</b>`,
                font: {
                    size: 16,
                    color: 'rgb(50,171,96)'
                }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(50,171,96)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }


        // plot the bar chart to the "bar" div
        Plotly.newPlot("bar", barData, barLayout);
    });
}


init();