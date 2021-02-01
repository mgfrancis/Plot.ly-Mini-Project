//function init() {

//Initialize visualizations
d3.json('/samples').then(data => {

  var selectdata = d3.select('#selDataset');

  var sampleNames = data['names'];

  //sorting if data is not sorted
  //sampleNames.sort((a,b) => (a-b));

    sampleNames.forEach(sample => {
      selectdata
        .append('option')
        .property('value', sample)
        .text(sample);
      
    });
  
    // use the first sample from the list to build the first plot
    var firstSample = sampleNames[0];

    buildCharts(firstSample);
    buildMetadata(firstSample);
  });


  //buildChart function
function buildCharts(sample) {
  d3.json('/samples').then(data => {
    var samples = data['samples'];
    var resultArray = samples['filter'](sampleObj => sampleObj['id'] == sample);
    var result = resultArray[0];

    var otu_ids = result['otu_ids'];
    var otu_labels = result['otu_labels'];
    var sample_values = result['sample_values'];

    // build the bubble chart
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'}
    };
    
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      }
    ];

    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // build the bar chart
    //this sorts the data and takes the TOP 10
    var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`);

    var barData = [
      {
        y: yticks.reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }
    ];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures',
      margin: {t: 30, l: 150},
      xaxis: {'title': 'Sample Values'},
      yaxis: {'title': 'OTU ID'}
    };

    Plotly.newPlot('bar', barData, barLayout);
  });
}

// build Metadata() function

function buildMetadata(sample) {
  d3.json('/samples').then((data) => {
    var metadata = data['metadata'];

    // filter the data for the object with the selected sample number
    var resultArray = metadata.filter(sampleObj => sampleObj['id'] == sample);
    var result = resultArray[0];

    //use d3 to select #sample-metadata id in html
    var Panel = d3.select('#sample-metadata');

    //remove any existing metadata so data does not append for each new id selected
    Panel.html('');

    //result refers to the objects (age, bbtype, etc) of the id's key and values
    Object.entries(result).forEach(([key, value]) => {
      Panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
    });

    //build the gauge chart
    wash_frequency = result.wfreq;
    buildGauge(wash_frequency);
  });
}

//buildGauge() function
function buildGauge(wash_frequency) {

  //Gauge chart
  var data = [
    {
      type: "indicator",
      mode: "gauge+number",
      value: wash_frequency,
      title: { text: "Weekly Wash Frequency", font: { size: 16 } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 9], color: "cyan" }
        ]
      }
    }
  ];

  var layout = {
    width: 350,
    height: 300,
    margin: { t: 25, r:25, l: 25, b:25},
    font: {size: 12 }
  };

  var gauge = d3.select('#gauge').node();
  Plotly.newPlot(gauge, data, layout);

}

function optionChanged(newSample) {

  //fetch corresponding data for each new sample selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
  /*
  
*/








/*
   Hints: Create additional functions to build the charts,
          build the gauge chart, set up the metadata,
          and handle the event listeners
   Recommended function names:
    optionChanged() 
    buildChart()
    buildGauge()
    buildMetadata()
*/

// Initialize the dashboard
//}

//init();
