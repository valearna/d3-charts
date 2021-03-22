import * as $ from 'jquery';
import * as d3 from 'd3';
import D3Heatmap from "@valearna/d3-heatmap";

$(document).ready(() => {
    let filterHeatmap = new D3Heatmap("#heatmap", 80, 25, 150, 180, 1280, 1280);

    d3.csv("http://localhost:3000/assets/cengen_mean_celltype_expression.csv", function (data) {
        let threeColsData = [];
        let cellNames = Object.keys(data[0]);
        cellNames = cellNames.filter(item => item !== "gene_id")
        data.forEach(row => {
            cellNames.forEach(name => {
                threeColsData.push({group: row["gene_id"], variable: name, value: -Math.log10(row[name])});
            })
        });
        threeColsData = threeColsData.slice(0, cellNames.length * 100)
        let valuesSorted = threeColsData.map(e => e.value).sort((a, b) => a - b);
        let max = valuesSorted[valuesSorted.length - 1];
        let min = valuesSorted[0];
        threeColsData = threeColsData.map(e => {return {group: e.group, variable: e.variable, value: Math.round((e.value - min) / (max - min) * 100) }})
        filterHeatmap.draw(threeColsData);
    })
})