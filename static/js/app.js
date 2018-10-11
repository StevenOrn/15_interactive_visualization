function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    url = "/metadata/"+sample;
    d3.json(url).then(function(response) {

      var metaPanel=d3.select('#sample-metadata');

      metaPanel.selectAll('p').remove();

      Object.entries(response).forEach(([key, value]) => {
        
        metaPanel.append('p').text(`${key}: ${value}`);
    });
    console.log('done')
  });


}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    url = "/samples/"+sample;
    d3.json(url).then(function(response) {
      //////////////////////////
      //BUBBLE CHART
      /////////////////////////

      var bubbleData =[{
        x:response.otu_ids,
        y:response.sample_values,
        mode: 'markers',
        marker: {
          size:response.sample_values,
          color: response.otu_ids.map(c=>`hsl(${Math.floor(c/10)+30},100%,50%)`)
        },
        text:response.otu_labels
      }];

      Plotly.newPlot('bubble', bubbleData);



      /////////////////////////
      //PIE CHART
      /////////////////////////

      //create an array of objects from object of arrays for sorting
      var arrayObject = [];
      for(let i=0; i<response.sample_values.length;i++)
        arrayObject.push( {values:response.sample_values[i], labels: response.otu_ids[i], hovertext: response.otu_labels[i]} );


      var sortedData = arrayObject.sort((a,b) => b.values-a.values);
      var slicedData = sortedData.slice(0, 10);

      var pieData = [{
        values: slicedData.map(row => row.values),
        labels: slicedData.map(row => row.labels),
        hovertext: slicedData.map(row => row.hovertext),
        type: 'pie'
      }];



      Plotly.newPlot("pie", pieData);

      var myPlot = document.getElementById('pie');
      myPlot.on('plotly_click', function(data){
        console.log(data);
      });


    });


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

