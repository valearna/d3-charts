import * as d3 from 'd3';

export function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", -3).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            if (word !== '') {
                line.push(word);
                tspan.text(line.join(" "));
                if (line.length > 1 && line.map(word => word.length).reduce((a, i) => a + i, 0) > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", -3).attr("y", y).attr("dy", lineHeight + dy + "em").text(word);
                }
            }
        }
    });
}