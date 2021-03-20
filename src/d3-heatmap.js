import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

class D3Heatmap {
    constructor(divId = "#heatmap", title = "", subtitle = "", top = 80, right = 25,
                bottom = 30, left = 40, width = 500, height = 500) {
        this.divId = divId;
        if (! this.divId.startsWith("#")) {
            this.divId = "#" + this.divId;
        }
        this.title = title;
        this.subtitle = subtitle;
        this.margin = {top: top, right: right, bottom: bottom, left: left}
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.svg = undefined;
        this.initialize();
    }

    initialize() {
        d3.select(this.divId).html("");
        // append the svg object to the body of the page
        this.svg = d3.select(this.divId)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.margin.left + "," + this.margin.top + ")");

        // Add title to graph
        this.svg.append("text")
            .attr("x", 0)
            .attr("y", -50)
            .attr("text-anchor", "left")
            .style("font-size", "22px")
            .text(this.title);

        // Add subtitle to graph
        this.svg.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "14px")
            .style("fill", "grey")
            .style("max-width", 400)
            .text(this.subtitle);
    }

    draw(data) {
        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(data, function (d) {
            return d.group;
        }).keys()
        var myVars = d3.map(data, function (d) {
            return d.variable;
        }).keys()

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, this.width])
            .domain(myGroups)
        this.svg.append("g")
            .style("font-size", 8)
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-60)")
            .select(".domain").remove()

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([this.height, 0])
            .domain(myVars)
        this.svg.append("g")
            .style("font-size", 8)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3ScaleChromatic.interpolateViridis)
            .domain([1, 100])

        // create a tooltip
        var tooltip = d3.select("#heatmap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        var mousemove = function (d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d.value)
                .style("position", "absolute")
                .style("left", (d3.mouse(this)[0] + 30) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
        }
        var mouseleave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 1)
        }

        // add the squares
        this.svg.selectAll()
            .data(data, function (d) {
                return d.group + ':' + d.variable;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.group)
            })
            .attr("y", function (d) {
                return y(d.variable)
            })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                return myColor(d.value)
            })
            .style("stroke", "none")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    }
}

export default D3Heatmap;