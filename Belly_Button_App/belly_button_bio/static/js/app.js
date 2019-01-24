function buildMetadata(sample) {

  // Build the url
  var url = "/metadata/" + sample

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {
    
    // Write the response to the console
    console.log(response);
    
    // Create a variable to hold the response
    var data = response;

    // Use d3 to select the html element that will hold the data
    var panel = d3.select("#sample-metadata");

    // Clear the html if it contains data
    panel.html("");

    // Add the meta data to the panel
    var list = panel.append("ul");
    list.classed("list-unstyled", true);

    // Write the key, value pairs to the console
    console.log(Object.entries(data));

    // Loop through the key, value pairs to create a meta data list
    Object.entries(data).forEach(([key, value]) => {
        var listItem = list.append("li");
        listItem.text(`${key}: ${value}`);
    });
  });
};

function buildCharts(sample) {

  // Build the url
  var url = "/samples/" + sample

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    console.log(response);
    
    // Create a trace for bubble plot
    trace1 = [{
      x: response.otu_ids,
      y: response.sample_values,
      mode: "markers",
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      },
      text: response.otu_labels
    }];

    // Create the layout for the bubble chart
    layout1 = {
      xaxis: {
        autorange: true,
        type: "linear",
        title: "OTU_ID"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };

    // Create the bubble plot
    Plotly.newPlot("bubble", trace1, layout1);

    // Create an array to store objects containing the data for each sample
    data = [];

    // Loop through the three data arrays to create dictionaries and add them to the 'data' array
    for (i = 0; i < response.otu_ids.length; i++) {
      data.push({
        id: response.otu_ids[i],
        value: response.sample_values[i],
        label: response.otu_labels[i]
      });
    };

    // Sort the 'data' array
    var sortedData = data.sort((a, b) => b.values - a.values);

    // Write the sorted array to the console
    console.log(sortedData);

    // Slice the array for the top ten values
    var topTen = data.slice(0, 10);

    // Create the trace for the pie chart for the top ten values
    trace2 = [{
      values: topTen.map(row => row.value),
      labels: topTen.map(row => row.id),
      hovertext: topTen.map(row => row.label),
      type: "pie"
    }];

    // Create the pie plot
    Plotly.newPlot("pie", trace2);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();

var scrubmax = 9;
var scrub = 4;
var percent = scrub / scrubmax;
// Enter a speed between 0 and 180
var level = 180 * percent;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data1 = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['8-9', '6-8', '4-6', '2-4',
            '1-2', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout3 = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Gauge Speed 0-100',
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data1, layout3);