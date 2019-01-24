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
