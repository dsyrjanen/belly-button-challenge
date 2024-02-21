function buildData() {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        console.log(data);

        let metadata = data.metadata;
        console.log(metadata);
        let samples = data.samples;
        console.log(samples);
        let names = data.names;
        console.log(names);
    });
}

function buildMetaData(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let metadata = data.metadata;
        let result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

        let panel = d3.select("#sample-metadata");
        panel.html("")
        for (key in result){
            panel.append("h6").text(`${key}: ${result[key]}`);
        }
    })
}

function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let samples = data.samples;
        let result = samples.filter(sampleObj => sampleObj.id == sample)[0];
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Bubble Chart
        let bubbleLayout = {
            title: "Bubble Chart"
        };

        let bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        

        // Bar Chart
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let barData = [
            {
                y: yticks,
                x: sample_values.slice(0,10).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        let barLayout = {
            title: "Top 10 Bacterias",
            margin: { t: 30, l: 150 }
        }
        Plotly.newPlot("bar", barData, barLayout)

    });
}

function init() {
    // Reference to selector element
    let selector = d3.select("#selDataset");

    // Use samples to populate dropdown
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        let sampleNames = data.names;

        for (i = 0; i < sampleNames.length; i++) {
            selector
                .append("option")
                .text(sampleNames[i])
                .property("value", sampleNames[i]);
        };

        let firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetaData(firstSample);
    });
}

function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetaData(newSample);
}

init();