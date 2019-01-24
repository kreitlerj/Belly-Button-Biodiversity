function buildMetadata(sample) {

  // Build the url
  var url = "/metadata/" + sample

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {

    console.log(response);

    var data = response;

    var panel = d3.select("#sample-metadata");

    panel.html("");

    var list = panel.append("ul");
    list.classed("list-unstyled", true);
    console.log(Object.entries(data));
    Object.entries(data).forEach(([key, value]) => {
        var listItem = list.append("li");
        listItem.text(`${key}: ${value}`);
    });
  });
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // Build the url
  var url = "/samples/" + sample
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    console.log(response);
    
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

    layout1 = {
      title: "Bubble"
      // xaxis: {
      //   autorange: true,
      //   type: "linear"
      // },
      // yaxis: {
      //   autorange: true,
      //   type: "linear"
      // }
    };
    Plotly.newPlot("bubble", trace1, layout1);

  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

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
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
