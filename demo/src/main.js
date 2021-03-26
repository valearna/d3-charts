import * as $ from 'jquery';
import * as d3 from 'd3';
import D3Heatmap from "@wormbase/d3-charts/dist/heatmap";
import D3Ridgeline from "@wormbase/d3-charts/dist/ridgeline";

$(document).ready(() => {
    let filterHeatmap = new D3Heatmap("#heatmap", 80, 25, 150, 180, 1280, 1280, 1, 10);

    d3.csv("http://localhost:3000/assets/cengen_mean_celltype_expression.csv", function (data) {
        let threeColsData = [];
        let cellNames = Object.keys(data[0]);
        cellNames = cellNames.filter(item => item !== "gene_id")
        data.forEach(row => {
            cellNames.forEach(name => {
                threeColsData.push({group: row["gene_id"], variable: name, value: -Math.log10(row[name]),
                    tooltip_html: "Value: " + -Math.log10(row[name])});
            })
        });
        threeColsData = threeColsData.slice(0, cellNames.length * 100)
        filterHeatmap.draw(threeColsData);
    })

    let ridgeLine = new D3Ridgeline();
    d3.csv("https://raw.githubusercontent.com/zonination/perceptions/master/probly.csv", function (data) {
        ridgeLine.draw(data);
    });

})