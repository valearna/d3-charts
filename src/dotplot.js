import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';

class Dotplot {
    constructor(divId = "#dotplot", top = 80, right = 25,
                bottom = 30, left = 40, width = 500, height = 500, minValue = 1,
                maxValue = 10, threshold = 0.001, circleSizeMultiplier = 100, colored = true) {
        this.divId = divId;
        if (! this.divId.startsWith("#")) {
            this.divId = "#" + this.divId;
        }
        this.margin = {top: top, right: right, bottom: bottom, left: left}
        this.width = width - this.margin.left - this.margin.right;
        this.height = height - this.margin.top - this.margin.bottom;
        this.svg = undefined;
        this.opacity = 0;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.threshold = threshold;
        this.multiplier = circleSizeMultiplier;
        this.colored = colored;
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
    }

    draw(data) {
        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var myGroups = d3.map(data, function (d) {
            return d.group;
        }).keys()
        var myVars = d3.map(data, function (d) {
            return d.variable;
        }).keys().reverse();

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([0, this.width])
            .domain(myGroups)
            .padding(0)
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

        this.svg.append("g")
            .call(d3.axisBottom(x).tickFormat("").tickSize(this.height))
            .attr("stroke-dasharray", "2,2")
            .attr("stroke-opacity", 0.5)

        // Build Y scales and axis:
        var y = d3.scaleBand()
            .range([this.height, 0])
            .domain(myVars)
            .padding(0)
        this.svg.append("g")
            .style("font-size", 8)
            .call(d3.axisLeft(y).tickSize(0))

        this.svg.append("g")
            .call(d3.axisLeft(y).tickFormat("").tickSize(-this.width))
            .attr("stroke-dasharray", "2,2")
            .attr("stroke-opacity", 0.5)

        // Build color scale
        var myColor = d3.scaleSequential()
            .interpolator(d3ScaleChromatic.interpolateViridis)
            .domain([this.minValue, this.maxValue])

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

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function (d) {
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("opacity", 1)
        }
        var mouseleave = function (d) {
            d3.select(this)
                .style("stroke", "none")
                .style("stroke-width", 0)
                .style("opacity", 1);
        }
        var mouseclick = function (d) {
            this.opacity = !this.opacity ? 1 : 0;
            if (this.opacity === 1) {
                tooltip
                    .html(d.tooltip_html)
                    .style("position", "absolute")
                    .style("left", (d3.mouse(this)[0] + 50) + "px")
                    .style("top", (d3.mouse(this)[1] + 50) + "px")
                    .style("opacity", 1)
            } else {
                tooltip
                    .html("")
                    .style("opacity", 0)
            }
        }

        let threshold = this.threshold;
        let multiplier = this.multiplier;
        let colored = this.colored;
        // add the dots
        this.svg.selectAll()
            .data(data, function (d) {
                return d.group + ':' + d.variable;
            })
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d.group) + x.bandwidth() / 2
            })
            .attr("cy", function (d) {
                return y(d.variable) + y.bandwidth() / 2
            })
            .attr("r", function(d) {
                if (d.value > threshold) {
                    return Math.min(d.value * multiplier * Math.min(x.bandwidth() / 4, y.bandwidth()) / 4, Math.min(x.bandwidth() / 4, y.bandwidth()))
                } else {
                    return 0
                }
            })
            .style("fill", function (d) {
                if (colored) {
                    return myColor(d.value)
                } else {
                    return "#000000"
                }
            })
            .style("stroke", "none")
            .style("stroke-width", 0)
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)
            .on("click", mouseclick)
    }
}

export default Dotplot;