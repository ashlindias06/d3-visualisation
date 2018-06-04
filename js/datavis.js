function stepOne() {
    var map;
    var mapCenter = new google.maps.LatLng(-37.814, 144.96332);
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 8,
        mapTypeId: 'roadmap',
        gestureHandling: "cooperative"
    });
    var crashArr = new Array();
    var crashLatLng = new Array();
    var lga_count;

    d3.csv("data/Crashes_Last_Five_Years.csv", function (d) {
        crashArr = d;
        crashArr.forEach(function (crash, index) {
            crashLatLng.push({location: new google.maps.LatLng(crash.LATITUDE, crash.LONGITUDE)});
        });
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: crashLatLng,
            maxIntensity: 300
        });
        heatmap.setMap(map);

        lga_count = distinct_count(crashArr, "LGA_NAME");

        var max_crashes_lga = max_count(lga_count);

        var barSvg = d3.select('#graphContainer')
            .append('svg')
            .attr('height', '100%')
            .attr('width', '100%');

        max_width = barSvg.style("width").replace('px', '');
        max_width = Number(max_width);

        var barThickness = 8;

        barSvg.selectAll('rect')
            .data(lga_count)
            .enter()
            .append('rect')
            .attr('class', 'bar1')
            .attr('width', function (h) {
                return ((h.value / max_crashes_lga) * max_width)
            })
            .attr('height', barThickness + 'px')
            .attr("x", function (d, i) {
                return 1
            })
            .attr("y", function (d, i) {
                return (i * barThickness) + 1
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
            .on('click', function (d) {
                stepTwo(d.key, crashArr, lga_count);
            });
    });

    $('#graphContainer2 select').change(function () {
        var lganame = $(this).val();
        stepTwo(lganame, crashArr,lga_count);
    });
}

