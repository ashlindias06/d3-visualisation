function stepTwo(lgaName, crashArr, nested_data) {

    $('#graphContainer2').fadeIn(2000);
    var selectLga = $('#graphContainer2 select');
    selectLga.empty();
    nested_data.forEach(function (d, index) {
        selectLga.append('<option value="' + d.key + '">' + d.key + '</option>');
    });

    selectLga.val(lgaName);

    $('html, body').animate({
        scrollTop: ($('#graphContainer2').offset().top)
    }, 500);

    var lga_filtered_crashes = crashArr.filter(function (d) {
        return d.LGA_NAME == lgaName;
    });

    render_accident_type(lga_filtered_crashes, "ACCIDENT_TYPE", "svg1", "bar2");
    render_accident_type(lga_filtered_crashes, "SEVERITY", "svg2", "bar3");
    render_accident_type(lga_filtered_crashes, "SPEED_ZONE", "svg3", "bar4");
    render_accident_type(lga_filtered_crashes, "NODE_TYPE", "svg4", "bar5");
    render_accident_type(lga_filtered_crashes, "LIGHT_CONDITION", "svg5", "bar6");
    render_accident_type(lga_filtered_crashes, "ROAD_GEOMETRY", "svg6", "bar7");
}

var graph_type_map = {
    "ACCIDENT_TYPE":"TYPES OF CRASHES",
    "SEVERITY":"TYPES OF INJURIES",
    "SPEED_ZONE":"CRASHES IN DIFFERENT SPEED ZONES",
    "NODE_TYPE":"ROAD INTERSECTIONS",
    "LIGHT_CONDITION":"CRASHES IN DIFFERENT LIGHT CONDITIONS",
    "ROAD_GEOMETRY":"CRASHES ON DIFFERENT ROAD GEOMETRY"
}

function render_accident_type(filtered_data, colName, svgId, barClass) {
    var crash_count_list = distinct_count(filtered_data, colName);

    var max_type_count = max_count(crash_count_list);

    var svg_width = d3.select('#' + svgId).style("width").replace('px', '');
    var svg_height = d3.select('#' + svgId).style("height").replace('px', '');

    var xScale = d3.scaleLinear()
        .domain([0,max_type_count])
        .range([0,svg_width])

    var xAxis = d3.axisTop()
        .scale(xScale)
        .tickSize(10);

    var svg = d3.select('#' + svgId);

    svg
        .selectAll('text')
        .remove()
        .transition().duration(600);

    svg
        .selectAll('g')
        .remove()
        .transition().duration(600);

    var graph_start_at = 55;
    var inter_bar_distance = 35;

    svg
        .append('g')
        .append('text')
        .attr('class','svg-text')
        .text(graph_type_map[colName])
        .transition().duration(600)

    svg.append('g')
        .attr('class','x-axis')
        .call(xAxis)
        .transition().duration(600)

    //Enter
    svg
        .selectAll('rect')
        .data(crash_count_list)
        .enter()
        .append('rect')
        .attr('class', barClass)
        .attr('width', function (h) {
            return ((h.value / max_type_count) * svg_width)
        })
        .attr('height', '30px')
        .attr("x", function (d, i) {
            return 1; //bar_start_from_x-axis
        })
        .attr("y", function (d, i) {
            return (i * inter_bar_distance) + graph_start_at
        })
        .on('mouseover', function (d) {
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html("<b>" + (d.key).toUpperCase() + ":" + d.value + " Crashes</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
        })
        .on('mouseout', function (d) {
            div.transition()
                .duration(100)
                .style("opacity", 0);
        })
        .transition().duration(600)

    //Exit
    svg
        .selectAll('rect')
        .data(crash_count_list)
        .exit()
        .attr('width', 0)
        .attr('fill', 'black')
        .remove()
        .transition().duration(600)

    //Update
    svg.selectAll('rect')
        .transition().duration(600)
        .attr('width', function (h) {
            return ((h.value / max_type_count) * svg_width)
        });

    svg
        .append('g')
        .selectAll('text')
        .data(crash_count_list)
        .enter()
        .append('text')
        .attr('x', 1)
        .attr('y', function(d, i) { return (i * inter_bar_distance) + 70 })
        .text(function(d) { return d.key; })
        .attr('font-size', 12)
        .transition().duration(600)


}