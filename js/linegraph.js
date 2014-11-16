var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;
var x;
var y;
var candlestick;
var close;
var xAxis;
var xTopAxis;
var yAxis;
var yRightAxis;
var ohlcAnnotation;
var ohlcRightAnnotation;
var timeAnnotation;
var timeTopAnnotation;
var svg;
var coordsText;
var trendline = techan.plot.trendline()
        .xScale(x)
        .yScale(y);
var maxClose = -1;
var minClose = -1;
var crosshair;

function configPopup(d){
    $("#linebody").empty();
    $('body').append('<div>');  
    $('#defaultGraphType').prop('checked', true);
}
function createNews(d){
    
}
function initLineGraph(){
    x = techan.scale.financetime()
            .range([0, width]);
    y = d3.scale.linear()
            .range([height, 0]);
    candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);
    close = techan.plot.close()
            .xScale(x)
            .yScale(y);
    xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    xTopAxis= d3.svg.axis()
            .scale(x)
            .orient("top");
    yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    yRightAxis = d3.svg.axis()
            .scale(y)
            .orient("right");
    ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .format(d3.format(',.2fs'));

    ohlcRightAnnotation = techan.plot.axisannotation()
            .axis(yRightAxis)
            .translate([width, 0])
            .format(d3.format(',.2fs'));
    timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .format(d3.time.format('%d-%b-%Y'))
            .width(65)
            .translate([0, height]);
    timeTopAnnotation = techan.plot.axisannotation()
            .axis(xTopAxis);


    svg = d3.select("#linebody").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);
    crosshair = techan.plot.crosshair()
        .xAnnotation([timeAnnotation, timeTopAnnotation])
        .yAnnotation([ohlcAnnotation, ohlcRightAnnotation])
        .on("enter", enter)
        .on("out", out)
        .on("move", move);
    }

$(function(){
    $( "#testingcode" ).click(function() {
        // #ben this part makes the lines. must be same date for start and end and set the start value as minimum value and end as max, this will create a straight line
        if( $('.trendlines').length){
            $(".trendlines").remove();
            $(".x.annotation.top").remove();
        } else {
            var trendlineData = [
                { start: { date: new Date(2013, 9, 9), value: minClose}, end: { date: new Date(2013, 9, 9), value: maxClose } }
            ];
            // #ben this part is where the line is created and added to the chart
            svg.append("g")
                .datum(trendlineData)
                .attr("class", "trendlines")
                .call(trendline);
        
            //here is for annotation to indicate of news occurence
            svg.append("g")
                .attr("class", "x annotation top")
                .datum([{value: new Date(2013, 9, 9)}])
                .call(timeAnnotation);
        }   
    });
});


function enter() {
    coordsText.style("display", "inline");
}

function out() {
    coordsText.style("display", "none");
}

// this part reflects the top right hand corner value
function move(coords) {
    coordsText.text(
        timeAnnotation.format()(coords[0][0]) + ", " + ohlcAnnotation.format()(coords[1][0])
    );
}

// this part here is to do the toggle
function updateData(inputval) {

    if(inputval===1){

        // remove first
        svg.selectAll(".close").remove();

        // this part here is draw candlestick
        d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
            var accessor = candlestick.accessor();

            data = data.map(function(d) {
                return {
                    date: parseDate(d.Date),
                    open: +d.Open,
                    high: +d.High,
                    low: +d.Low,
                    close: +d.Close,
                    volume: +d.Volume
                };
            }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });


            x.domain(data.map(accessor.d));
            y.domain(techan.scale.plot.ohlc(data, accessor).domain());

            svg.append("g")
                .datum(data)
                .attr("class", "candlestick")
                .call(candlestick);
        });

    }else{

        // remove first
        svg.selectAll(".candlestick").remove();

        // this part here is draw line
        d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
            var accessor = close.accessor();

            data = data.map(function(d) {
                return {
                    date: parseDate(d.Date),
                    open: +d.Open,
                    high: +d.High,
                    low: +d.Low,
                    close: +d.Close,
                    volume: +d.Volume
                };
            }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });


            x.domain(data.map(accessor.d));
            y.domain(techan.scale.plot.ohlc(data, accessor).domain());

            svg.append("g")
                    .datum(data)
                    .attr("class", "close")
                    .call(close);

        });

    }
}
function makeLineGraph(){
    // this part here is draw the outline
    d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
        var accessor = candlestick.accessor();

        data = data.map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        
        x.domain(data.map(accessor.d));
        var doma = techan.scale.plot.ohlc(data, accessor).domain();
        
        // steal lower and upp from their domain method
        minClose = doma[0];
        maxClose = doma[1];
        
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());
        
        // draw top line
        svg.append("g")
                .attr("class", "x axis")
                .call(xTopAxis);

        //draw bottom line
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        //draw left line
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

        //draw right line
        svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + width + ",0)")
                .call(yRightAxis);
        
        
        svg.append('text')
                .attr("x", 5)
                .attr("y", 15)
                .text(selectedCompany.company);
    });
    
    // this part here is draw line graph
    d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
        var accessor = close.accessor();

        data = data.map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        
        
        x.domain(data.map(accessor.d));
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());

        svg.append("g")
                .datum(data)
                .attr("class", "close")
                .call(close);
        svg.append('g')
                .attr("class", "crosshair")
                .call(crosshair);
    });

}
    