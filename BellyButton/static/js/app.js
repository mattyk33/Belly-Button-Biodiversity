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


// Create the function for the initial data rendering
function init() {

    // Read the json file to get data
    d3.json("data/samples.json").then(function(data) {

        var idNumber = data.names;
        
        // Append id data to the dropdwown menu
        for (var i = 0; i < idNumber.length; i++) {
            dropDownMenu.append("option").text(idNumber[i]);
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
            demographTable.append("h5").text(`${key}: ${value}`);

        });
    });
}

// Create a function to plot charts
function buildPlots(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data) => {

        // Filter samples for plotting
        var sample = data.samples.filter(samp => samp.id == id)[0];
        console.log(sample)
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

        // Slice and reverse the arrays to get the top 10
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();
        console.log(topOtuIds)
        console.log(topOtuLabels)
        console.log(topSampleValues)
        // "OTU" labels added to topOtuIds
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
                color: 'rgb(100,45,80)'
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
        };


        // Plot Bar Chart
        Plotly.newPlot("bar", barData, barLayout);


        // PLOT BUBBLE CHART


        // Creat variables
        var sam = data.samples.filter(samp => samp.id == id)[0];

        var xvalues = sam.otu_ids;
        var yvalues = sam.sample_values;
        var textvalues = sam.otu_labels;
        console.log(yvalues)

        // Create trace
        var bubTrace = {
            x: xvalues,
            y: yvalues,
            text: textvalues,
            mode: 'markers',
            marker: {
                size: yvalues,
                color: xvalues,
                colorscale: 'Electric'
            },
            type: 'scatter'
        };

        // Create data array
        var bubData = [bubTrace];

        // Define plot layout
        var bubLayout = {
            font: {
                family: 'Arno Pro'
            },
            hovermode: "closest",
            hoverlabel: {
                font: {
                    family: 'Arno Pro'
                }
            },
            xaxis: {
                title: "<b>OTU Id</b>",
                color: 'rgb(70,80,150)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(70,80,150)'
            },
            showlegend: false,
        };

        // Plot Bubble Chart
        Plotly.newPlot('bubble', bubData, bubLayout);


        // PLOT GAUGE CHART


        // Create variables
        var metaResult = data.metadata.filter(meta => meta.id.toString() === id)[0];
        var washfreq = metaResult.wfreq;

        // Create data array
        var gaugeData = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(washfreq),
            title: { text: `Belly Button Scrubs Per Week` },
            type: "indicator",
            
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                     bar: { color: "red" },
                     steps: [
                      { range: [0, 1], color: 'rgb(0,140,0)' },
                      { range: [1, 2], color: 'rgb(0,130,0)' },
                      { range: [2, 3], color: 'rgb(0,120,0)' },
                      { range: [3, 4], color: 'rgb(0,110,0)' },
                      { range: [4, 5], color: 'rgb(0,100,0)' },
                      { range: [5, 6], color: 'rgb(0,90,0)' },
                      { range: [6, 7], color: 'rgb(0,80,0)' },
                      { range: [7, 8], color: 'rgb(0,70,0)' },
                      { range: [8, 9], color: 'rgb(0,60,0)' },
                    ]}
                
            }
          ];

        // Define plot layout
          var gaugeLayout = { 
              width: 600, 
              height: 600, 
              margin: { t: 20, b: 40, l:100, r:100 },
              font: { color: "darkblue", family: "Arial" }
            };

        // Plot Gauge Chart
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);   

    });
}


init();