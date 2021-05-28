import * as d3 from 'd3';
import { wrap } from './lib';

class Swarmplot {
    constructor(divId = "#swarmplot", top = 60, right = 30, bottom = 20,
                left = 110, width, height, maxLabelLength) {
        this.divId = divId;
        if (! this.divId.startsWith("#")) {
            this.divId = "#" + this.divId;
        }
        this.margin = {top: top, right: right, bottom: bottom, left: left};
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.maxLabelLength = maxLabelLength;
        this.opacity = 0;
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
        let minX = Math.min(...data.map(d => d.x));
        let maxX = Math.max(...data.map(d => d.x));

        let yDomain = data.map(d => d.y);

        var svg = this.svg;

        // Add X axis
        var x = d3.scaleLinear()
            .domain([minX, maxX])
            .range([ 0, this.width ]);
        svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x));

        // Create the Y axis for names
        var yName = d3.scaleBand()
            .domain(yDomain)
            .range([0, this.height])
            .paddingInner(1)
        svg.append("g")
            .call(d3.axisLeft(yName).tickSize(0))
            .selectAll(".tick text")
            .call(wrap, this.maxLabelLength);

        svg.append("line")
            .attr("x1", x(0))  //<<== change your code here
            .attr("y1", 0)
            .attr("x2", x(0))  //<<== and here
            .attr("y2", this.height)
            .style("stroke-width", 1)
            .style("stroke", "black")
            .style("stroke-dasharray", ("3, 3"))
            .style("fill", "none");

        // create a tooltip
        var tooltip = d3.select(this.divId)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            d3.select(this)
                .style("stroke", "#02a169")
                .style("stroke-width", 2)
                .style("opacity", 1)
            tooltip
                .html(d.tooltip_html)
                .style("position", "absolute")
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1] + 80) + "px")
                .style("opacity", 1)
        }
        var mouseleave = function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", 0)
            tooltip
                .html("")
                .style("opacity", 0)
        }

        // Add dots
        this.svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.x); } )
            .attr("cy", function (d) { return yName(d.y); } )
            .attr("r", 2)
            .style("fill", function(d) {
                if (d.selected !== undefined && d.selected) {
                    return "red";
                } else {
                    return "black";
                }})
            .style("stroke", "none")
            .style("stroke-width", 0)
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
    }
}

export default Swarmplot;