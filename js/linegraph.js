var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 900 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

var overallData;

var parseDate = d3.time.format("%d-%b-%y").parse;
var trendline,crosshair,volume,x,y,candlestick,close,xAxis,xTopAxis,yAxis,yRightAxis,ohlcAnnotation,ohlcRightAnnotation,timeAnnotation,timeTopAnnotation, svg, coordsText,newsdata, currentNewsdata;

var maxClose = -1;
var minClose = -1;
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var megatitleitem=$("<h5/>"), titleitem=$("<b/>").addClass("list-group-item-heading"), 
newslistitem = $("<li/>").addClass("list-group-item").click(function(){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
    } else {
        $(this).addClass("active");
    }
    drawVerticalTrendLine();
}), newslink = $("<p/>").text("link").attr("target","_blank").click(function(){
    window.open($(this).attr("url"),'Anna News',width=600,height=300);
}),
descriptionitem = $("<p/>").addClass("list-group-item-text"), 
smalldate=$("<small/>");;

function htmlDecode(value){
  return $('<div/>').html(value).text();
}
function htmlEncode(value){
  return $('<div/>').text(value).html();
}
function configPopup(d){
    $("#popupElementDiv").css({'height': $( window ).height()+'px'});
    $("#linebody").empty();
    $("#companydisplayinfo").empty();
    var companyInfo = $("#companyInfo")
        .clone()
        .show();
    companyInfo.find('#companyName').text(d.company);
    companyInfo.find('#companySymbol').text(d.name);
    companyInfo.find('#companyValue').text("$"+d.close);
    companyInfo.find('#growthVal')
        .text(d3.round(d.netChange,2))
        .attr("color",d.netChange>0?"green":d.netChange==0?"grey":"red");
    companyInfo.find('#growthPercent')
        .text("("+d3.round(d.percentage,2)+"%)")
        .attr("color",d.netChange>0?"green":d.netChange==0?"grey":"red");

    if(d.netChange>0){
        companyInfo.find('#postiveIcon').show();
        companyInfo.find('#negativeIcon').hide();
    } else if(d.netChange<0){
        companyInfo.find('#postiveIcon').hide();
        companyInfo.find('#negativeIcon').show();
    } else {
        companyInfo.find('#postiveIcon').hide();
        companyInfo.find('#negativeIcon').hide();
    }

    $("#companydisplayinfo").append(companyInfo);
    $('#defaultGraphType').prop('checked', true);
}
function mysqlStupidDateFormat(yyddmm){
    var parts = yyddmm.split("-");
    return parts[2] + " " + months[parts[1]-1] + " "+ parts[0];
}
function populateNews(d){
    updateNews(d.name);
}
function drawVerticalTrendLine(){
    $("#news-list").children().each(function(){
        if($(this).hasClass("active")){
            // populate this news onto news-description
            $(".trendlines").remove();
            $(".x.annotation.top").remove();
            var dateParts = $(this).attr("date").split("-");
            var newsDate = new Date(dateParts[0], dateParts[1], dateParts[2]);
            var trendlineData = [
                { start: { date: newsDate, value: minClose}, end: { date: newsDate, value: maxClose } }
            ];
            // this part is where the line is created and added to the chart
            svg.append("g")
                .datum(trendlineData)
                .attr("class", "trendlines")
                .call(trendline);
            //here is for annotation to indicate of news occurence
            svg.append("g")
                .attr("class", "x annotation top")
                .datum([{value: newsDate}])
                .call(timeAnnotation);
        }
    });
}
function updateNewsList(){
    $("#news-list").empty();
    if(newsdata!=null){
        for(var i=0;i<newsdata.length;i++){
            var news = newsdata[i];
            var newsitemcontainer = newslistitem.clone(true);
            var newsheader = titleitem.clone(true).text(htmlDecode(news.headline)+" ");
            newsheader.appendTo(newsitemcontainer);
            descriptionitem.clone(true).text(htmlDecode(news.description)).appendTo(newsitemcontainer);
            newsitemcontainer.attr("date",news.date);
            newsitemcontainer.attr("newsid",news.id);
            newslink.clone(true).attr("url",news.link).appendTo(newsitemcontainer);
            newsitemcontainer.appendTo($("#news-list"));
        }
    }
    $("#news-list").children().first().addClass("active");
    drawVerticalTrendLine();
}
function updateNews(stock){
    var url = "./php_scripts/ajax/query/single_company_news.php?symbol="+stock;
    $.get(url,function(data,status){
        newsdata = jQuery.parseJSON(data);
        updateNewsList();
    });
}
function initLineGraph(){
    x = techan.scale.financetime()
            .range([0, width]);
    y = d3.scale.linear()
            .range([height, 0]);
    volume = techan.plot.volume()
            .accessor(techan.accessor.ohlc()) // For volume bar highlighting
            .xScale(x)
            .yScale(y);
    trendline = techan.plot.trendline()
            .xScale(x)
            .yScale(y);
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

function enter() {
    coordsText.style("display", "inline");
}

function out() {
    coordsText.style("display", "none");
}

// this part reflects the top right hand corner value
function move(coords) {
    
    for(var i=0;i<overallData.length;i++){
        if(timeAnnotation.format()(overallData[i].date)===timeAnnotation.format()(coords[0][0])){
            coordsText.text(
                timeAnnotation.format()(coords[0][0]) 
                + ", " + ohlcAnnotation.format()(overallData[i].open)
                + ", " + ohlcAnnotation.format()(overallData[i].high)
                + ", " + ohlcAnnotation.format()(overallData[i].low)
                + ", " + ohlcAnnotation.format()(overallData[i].close)
            );
        }

    }
    
}

// this part here is to do the toggle
function updateData(inputval) {

    if(inputval===1){ // candlestick

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

    }else{ // line chart

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
    d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
        var accessor = volume.accessor();

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

        overallData=data;

        x.domain(data.map(accessor.d));
        y.domain(techan.scale.plot.volume(data, accessor.v).domain());

        svg.append("g")
            .datum(data)
            .attr("class", "volume")
            .call(volume);
    });
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
        
        y.domain(doma);
        
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
    