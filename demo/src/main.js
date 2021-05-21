import * as $ from 'jquery';
import * as d3 from 'd3';
import {Ridgeline, Dotplot} from "@wormbase/d3-charts";

$(document).ready(() => {
    let dotplot = new Dotplot("#dotplot", 80, 25, 150, 100, 1200, 800, 0, 0.1, 0.01, 30, true, 30);

    d3.csv("http://localhost:3000/assets/cengen_mean_celltype_expression.csv", function (data) {
        let threeColsData = [];
        let cellNames = Object.keys(data[0]);
        cellNames = cellNames.filter(item => item !== "gene_id").slice(0, 10)
        data.forEach(row => {
            cellNames.forEach(name => {
                threeColsData.push({group: row["gene_id"], variable: name + "      hellllloooooooo", value: row[name],
                    tooltip_html: "Value: " + -Math.log10(row[name])});
            })
        });
        threeColsData = threeColsData.slice(0, cellNames.length * 10)
        dotplot.draw(threeColsData);
    })

})