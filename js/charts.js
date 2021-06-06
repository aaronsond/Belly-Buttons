function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredArray = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = filteredArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = firstSample.otu_ids
    var labels = firstSample.otu_labels
    var values = firstSample.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    // y_data = ids.slice(0,10).map()
     
    var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`)
    // 8. Create the trace for the bar chart. 
    var barTrace = {
      x: values,
      y: (yticks),
      type: "bar",
      orientation: "h" 
    };
    
    var barData = [barTrace]
    
      
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Quantity" },
      // xaxis: {autorange: "reversed"}, 
      yaxis: { title: "Bacteria ID"},
      yaxis: {autorange: "reversed"}, 
      // dimensions: {label: "array"},
      margin: { t:31, l:100}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    console.log(data)

    // 1. Create the trace for the bubble chart.
    
    var bubbleTrace = {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ]
            }

    }
    var bubbleData = [bubbleTrace]
   
    

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.

    var metaArray = data.metadata;
    var filteredMetadata = metaArray.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = filteredMetadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.


    // 3. Create a variable that holds the washing frequency.
    var wash = parseFloat(firstMeta.wfreq);

    // Create the yticks for the bar chart.

    // // Use Plotly to plot the bar data and layout.
    // Plotly.newPlot();
    
    // // Use Plotly to plot the bubble data and layout.
    // Plotly.newPlot();
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      domain: { x: [0, 1], y: [0, 1] },
    value: wash,
    title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 10] },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8, 10], color: "green" }
      ],


    }
  }
 
    var gaugeData = [gaugeTrace]
     
    
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      // title: "Belly Button Washing Frequency",
      font: { family: "Impact" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);




  });
}



    
// // 1. Create a variable that filters the metadata array for the object with the desired sample number.

  
//     // Create a variable that holds the first sample in the array.
  

//     // 2. Create a variable that holds the first sample in the metadata array.
    

//     // Create variables that hold the otu_ids, otu_labels, and sample_values.


//     // 3. Create a variable that holds the washing frequency.
   
//     // Create the yticks for the bar chart.

//     // // Use Plotly to plot the bar data and layout.
//     // Plotly.newPlot();
    
//     // // Use Plotly to plot the bubble data and layout.
//     // Plotly.newPlot();
   
    
//     // 4. Create the trace for the gauge chart.
//     var gaugeData = [
     
//     ];
    
//     // 5. Create the layout for the gauge chart.
//     var gaugeLayout = { 
     
//     };

//     // 6. Use Plotly to plot the gauge data and layout.
//     Plotly.newPlot();
//   });
// }







// // // Bar and Bubble charts
// // // Create the buildCharts function.
// // function buildCharts(sample) {
// //   // Use d3.json to load and retrieve the samples.json file 
// //   d3.json("samples.json").then((data) => {
    

// //     // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
// //     Plotly.newPlot(); 

// //     // 1. Create the trace for the bubble chart.
// //     var bubbleData = [
   
// //     ];

// //     // 2. Create the layout for the bubble chart.
// //     var bubbleLayout = {
      
// //     };

// //     // 3. Use Plotly to plot the data with the layout.
// //     Plotly.newPlot(); 
// //   });
// // }
