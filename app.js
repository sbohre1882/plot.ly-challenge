
// Part 1. Read samples.json using d3

function getPlot(id) {
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // Get Id's in string
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
  
        // slice out the top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // reverse order top 10 otu id's
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        var OTU_id = OTU_top.map(d => "OTU " + d)  
  
        // get corresponding labels
        var labels = samples.otu_labels.slice(0, 10);
  
     //Part 2. Create horizontal bar chart, using otu values for labels
        
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        var data = [trace];
  
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // plot using Plotly
        Plotly.newPlot("bar", data, layout);

      
// Part 3. Create Bubble Chart that dispalys each sample. 
// use otu labels and ids
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set the layout for the bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        var data1 = [trace1];
  
        // Plot using Plotly
        Plotly.newPlot("bubble", data1, layout_b); 
  
        
// Part 4 and 5. Display sample metadata. 
function getInfo(id) {
    // read the json file to get data
    d3.json("Data/samples.json").then((data)=> {
        
        // get the metadata info 
        var metadata = data.metadata;

        //console.log(metadata)

        // filter info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel 
        demographicInfo.html("");

        // append demo info to graphic
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create function to initialize data search with dropdown
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("Data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call functions 
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();