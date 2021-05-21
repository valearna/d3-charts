import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import { wrap } from './lib';

function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k, scale) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0
    };
}

class Ridgeline {
    constructor(divId = "#ridgeline", top = 60, right = 30, bottom = 20,
                left = 110, width, height, xdomain = [-10, 100], ydomain = [0, 1],
                k = 7, maxLabelLength = 1000) {
        this.divId = divId;
        if (! this.divId.startsWith("#")) {
            this.divId = "#" + this.divId;
        }
        this.margin = {top: top, right: right, bottom: bottom, left: left};
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.xdomain = xdomain;
        this.ydomain = ydomain;
        this.k = k;
        this.maxLabelLength = maxLabelLength;
        d3.select(this.divId).html("");
        this.svg = d3.select(this.divId)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    draw(data) {
        // Get the different categories and count them
        var categories = Object.keys(data);
        var n = categories.length

        var svg = this.svg;

        // Add X axis
        var x = d3.scaleLinear()
            .domain(this.xdomain)
            .range([ 0, this.width ]);
        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x));

        // Create a Y scale for densities
        var y = d3.scaleLinear()
            .domain(this.ydomain)
            .range([ this.height, 0]);

        // Create the Y axis for names
        var yName = d3.scaleBand()
            .domain(categories)
            .range([0, this.height])
            .paddingInner(1)
        svg.append("g")
            .call(d3.axisLeft(yName))
            .selectAll(".tick text")
            .call(wrap, this.maxLabelLength);

        // Compute kernel density estimation for each column:
        var kde = kernelDensityEstimator(kernelEpanechnikov(this.k, this.scale), x.ticks(100)) // increase this 40 for more accurate density.
        var allDensity = []
        for (let i = 0; i < n; i++) {
            let key = categories[i]
            let density = kde(data[key]);
            allDensity.push({key: key, density: density, yLevel: i})
        }

        let height = this.height;
        // Add areas
        svg.selectAll("areas")
            .data(allDensity)
            .enter()
            .append("path")
            .attr("transform", function(d){
                return("translate(0," + (yName(d.key)-height) +")" )})
            .attr("fill", function(d){
                return d3ScaleChromatic.interpolateSinebow(d.yLevel/n)})
            .datum(function(d){return(d.density)})
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .attr("d",  d3.line()
                .curve(d3.curveBasis)
                .x(function(d) { return x(d[0]); })
                .y(function(d) { return y(d[1]); })
            )
    }
}

export default Ridgeline;