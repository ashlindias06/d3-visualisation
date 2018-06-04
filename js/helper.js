function distinct_count(crashes, attributeName) {
    return d3.nest()
        .key(function (d) {
            return d[attributeName];
        })
        .rollup(function (ids) {
            return ids.length;
        })
        .entries(crashes);
}

function max_count(nestedArray) {
    var max_number = 0;
    nestedArray.forEach(function (nd, index) {
        if (max_number < nd.value) {
            max_number = nd.value;
        }
    });
    return max_number;
}