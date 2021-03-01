import * as $ from 'jquery';
import * as d3 from 'd3';
import D3Heatmap from "@valearna/d3-heatmap";

$(document).ready(() => {
    let filterHeatmap = new D3Heatmap("#heatmap", "Heatmap Demo", "Filter Heatmap", 80, 25, 30, 40, 500, 500);
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function (data) {
        filterHeatmap.draw(data);
    })
})