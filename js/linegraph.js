var vol_format = d3.format("0,000"); 
	
var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = $(window).width()/2+10 - margin.left - margin.right,
        height = $(window).height()-300 - margin.top - margin.bottom;
        volumeHeight = height*.4;

var OverallData;

var parseDate = d3.time.format("%d-%b-%y").parse;

var sma0,sma1,ema2,bisectDate,volumeAxis,yVolume,zoom,trendline,crosshair,volume,x,y,candlestick,close,xAxis,xTopAxis,yAxis,yRightAxis,ohlcAnnotation,ohlcRightAnnotation,timeAnnotation,timeTopAnnotation, svg, coordsText,newsdata, currentNewsdata;

var bisectDate,yVolume,zoom,trendline,crosshair,volume,x,y,candlestick,close,xAxis,xTopAxis,yAxis,yRightAxis,ohlcAnnotation,ohlcRightAnnotation,timeAnnotation,timeTopAnnotation, svg, coordsText,newsdata, currentNewsdata;
var colorStack = ["#ff9900","#ff3300","#6666cc","#669900","#cc6666"];
var lighterColorStack = ["#ffd089","#ffb19d","#b0b0e5","#ddff99","#e0a1a1"];
var newsLineStack;
var maxClose = -1;
var minClose = -1;
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var titleitem=$("<b/>").addClass("list-group-item-heading"), 
newslistitem = $("<li/>").addClass("list-group-item").click(function(){
    var doIChange = 0;
    for(var index in newsLineStack){
        if(newsLineStack[index]!=""){
            doIChange+=1;
        }
    }
    if(doIChange<5 || $(this).hasClass("markedt")){
        if($(this).hasClass("markedt")){
            for(var index in newsLineStack){
                if($(this).attr("date")==newsLineStack[index]){
                    newsLineStack[index] = "";
                    break;
                }
            }
            $(this).removeClass("markedt");
        } else {
            $(this).addClass("markedt");
        }
        drawVerticalTrendLine();
        var count = 0;
        // count the number of selected news
        for(var index in newsLineStack){
            if(newsLineStack[index]!=""){
                count+=1;
            }
        }
        if(count==0){
            $("#newsinstruction").text("Click news to mark date on chart");
        } else {
            $("#newsinstruction").text("You can mark "+(newsLineStack.length-count)+" more news");
        }
    }
}), newslink = $("<a/>").attr("target","_blank").attr("style","color:black;").text("Link ").click(function(){
    window.open($(this).attr("url"),'Anna News',600,300);
}), icon=$("<span/>").attr("style","color:black;").addClass("glyphicon glyphicon-globe").appendTo(newslink), marked=$("<span/>").addClass("marker").attr("style","float:right;"),
descriptionitem = $("<p/>").addClass("list-group-item-text"), 
smalldate=$("<small/>").attr("style","float:right; margin-left:5px;");

function htmlDecode(value){
  return $('<div/>').html(value).text();
}
function htmlEncode(value){
  return $('<div/>').text(value).html();
}
function configPopup(d){
    $("#linebody").empty();
    $("#companydisplayinfo").empty();
    $("#companydisplayinfo").empty();
    $("#Vol").prop('checked', false);
    $("#SMA1").prop('checked', false);
    $("#SMA0").prop('checked', false);
    $("#EMA").prop('checked', false);
    // reset news line
    newsLineStack = ["","","","",""];
    $("#news-list").empty();

    width = chartWidth/2+30;
    height = chartHeight-250;
    var companyInfo = $("#companyInfo")
        .clone()
        .show();
    companyInfo.find('#companyName').text(d.company);
    companyInfo.find('#companySymbol').text(d.name);
    companyInfo.find('#companyValue').text("USD $"+d.close);
    companyInfo.find('#growthVal')
        .text(d3.round(d.netChange,2))
        .attr("color",d.netChange>0?"#1869f3":d.netChange==0?"#BEBEBE":"#e04810");
    companyInfo.find('#growthPercent')
        .text("("+d3.round(d.percentage,2)+"%)")
        .attr("color",d.netChange>0?"#1869f3":d.netChange==0?"#BEBEBE":"#e04810");

	console.log(d);
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
	companyInfo.find('#companyVol').text(vol_format(d.volume));
	var avgVol; 
	if(d.avgvol.indexOf("N\/A")!=-1){
		avgVol = "N/A";
	} else {
		avgVol = d.avgvol;
	}
    companyInfo.find('#avgVol').text(avgVol);
	var marketcap;
	if(d.marketcap.indexOf("N\/A")!=-1){
		marketcap = "N/A";
	} else {
		marketcap = d.marketcap;
	}	
    companyInfo.find('#marketcap').text(marketcap);
	var pe; 
	if(isNaN(d.pe)){
		pe = "N/A";
	}else {
		pe = +d.pe;
	}
	companyInfo.find('#pe').text(pe);
	var dayrange; 
	if(d.dayrange.indexOf("N\/A")!=-1){
		dayrange = "N/A";
	} else {
		dayrange = d.dayrange;
	}
    companyInfo.find('#dayrange').text(dayrange);
	var fiftytwowkrange = d.fiftytwowkrange; 
	if(fiftytwowkrange.indexOf("\/")!=-1){
		fiftytwowkrange = fiftytwowkrange.replace("\/", "/");
	}
    companyInfo.find('#yearrange').text(fiftytwowkrange);
	var eps; 
	if(isNaN(d.eps) && d.eps.indexOf("\/")!=-1){
		eps = eps.replace("\/", "/");
	}else if (isNaN(d.eps)) {
		eps = "N/A";
	}else {
		eps = +d.eps; 
	}
	companyInfo.find('#eps').text(eps);
	var divandyield; 
	if(isNaN(d.divandyield) && d.divandyield.indexOf("\/")!=-1){
		divandyield = d.divandyield.replace("\/", "/");
	}else if (isNaN(d.divandyield)) {
		divandyield = "N/A";
	}else {
		divandyield = +d.divandyield;
	}
    companyInfo.find('#divandyield').text(divandyield);

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
    $(".trendlines").remove();
    $(".x.annotation.top").remove();

    $("#news-list").children().each(function(){
        if($(this).hasClass("markedt")){
            // populate this news onto news-description
            var dateParts = $(this).attr("date").split("-");
            var newsDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
            var trendlineData = [
                { start: { date: newsDate, value: minClose}, end: { date: newsDate, value: maxClose } }
            ];
            // is it already inside newsLineStack
            var index = 0, matchedOnIndex=-1;
            for(var newsLine in newsLineStack){
                if(newsLineStack[newsLine]==$(this).attr("date")){
                    matchedOnIndex = index;
                    break;
                }
                index+=1;
            }
            // get a color not used
            if(matchedOnIndex==-1){
                index = 0;
                for(var newsLine in newsLineStack){
                    if(newsLineStack[newsLine]==""){
                        matchedOnIndex = index;
                        break;
                    }
                    index+=1;
                }
            }
            // set color
            if(matchedOnIndex!=-1 && matchedOnIndex<colorStack.length){
                newsLineStack[matchedOnIndex] = $(this).attr("date");
                var color = colorStack[matchedOnIndex];
                svg.append("g")
                    .datum(trendlineData)
                    .attr("class", "trendlines")
                    .attr("style", "stroke:"+color+";")
                    .call(trendline);
                $(this).attr("style","background:"+lighterColorStack[matchedOnIndex]+";"); 
            } else {
                $(this).attr("style","background:white;"); 
            }
        } else {
            $(this).attr("style","background:white;"); 
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
            var marker = marked.clone(true);
            newsheader.appendTo(newsitemcontainer);
            descriptionitem.clone(true).text(htmlDecode(news.description)).appendTo(newsitemcontainer);
            newsitemcontainer.attr("date",news.date);
            newsitemcontainer.attr("newsid",news.id);
            newslink.clone(true).attr("url",news.link).appendTo(newsitemcontainer);
            smalldate.clone(true).text(news.date).appendTo(newsitemcontainer);
            marker.appendTo(newsitemcontainer);
            newsitemcontainer.appendTo($("#news-list"));
        }
    }
}
function updateNews(stock){
    var url = "./php_scripts/ajax/query/single_company_news.php?symbol="+stock;
    $.get(url,function(data,status){
        newsdata = jQuery.parseJSON(data);
        updateNewsList();
    });
}
function initLineGraph(){
    bisectDate = d3.bisector(function(d) { return d.date; }).left;
    x = techan.scale.financetime()
            .range([0, width]);
    y = d3.scale.linear()
            .range([height, 0]);
	yVolume = d3.scale.linear()
            .range([height, height - volumeHeight]);
    volume = techan.plot.volume()
            .accessor(techan.accessor.ohlc()) // For volume bar highlighting
            .xScale(x)
            .yScale(yVolume);
	zoom = d3.behavior.zoom()
            .on("zoom", draw);
    candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

	// here is for the indicator
	sma0 = techan.plot.sma()
			.xScale(x)
			.yScale(y);
	sma1 = techan.plot.sma()
			.xScale(x)
			.yScale(y);
	ema2 = techan.plot.ema()
			.xScale(x)
			.yScale(y);
			
    close = techan.plot.close()
            .xScale(x)
            .yScale(y);
    xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
    yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
	
	volumeAxis = d3.svg.axis()
			.scale(yVolume)
			.orient("left")
			.ticks(3)
			.tickFormat(d3.format(",.3s"));
			
    svg = d3.select("#linebody").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
    svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", y(1))
            .attr("width", width)
            .attr("height", y(0) - y(1));
// append the x line
    svg.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    svg.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the circle at the intersection
    svg.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);
    svg.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#clip)");
	// LINE REMOVE
	svg.append("g")
			.attr("class", "close")
			.attr("clip-path", "url(#clip)");
			
	// CHART REMOVE
	svg.append("g")
			.attr("class", "candlestick")
			.attr("clip-path", "url(#clip)");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");
    
    svg.append("g")
			.attr("class", "volume axis")
			.attr("transform", "translate(" + width + ",0)")
			.call(volumeAxis);

    svg.append("rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .on("mousemove", mousemove)
            .on("mouseout", hidecoords)
            .call(zoom);
    ohlcAnnotation = techan.plot.axisannotation()
            .axis(yAxis)
            .format(d3.format(',.2fs'));

    timeAnnotation = techan.plot.axisannotation()
            .axis(xAxis)
            .format(d3.time.format('%d-%b-%Y'))
            .width(65)
            .translate([0, height]);
    crosshair = techan.plot.crosshair()
        .xAnnotation([timeAnnotation, timeTopAnnotation])
        .yAnnotation([ohlcAnnotation, ohlcRightAnnotation]);
    coordsText = svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", width - 5)
            .attr("y", 15);
    trendline = techan.plot.trendline()
            .xScale(x)
            .yScale(y);
	
	// here is for indicator
	svg.append("g")
			.attr("class", "indicator sma ma-0")
			.attr("clip-path", "url(#clip)");

	svg.append("g")
			.attr("class", "indicator sma ma-1")
			.attr("clip-path", "url(#clip)");

	svg.append("g")
			.attr("class", "indicator ema ma-2")
			.attr("clip-path", "url(#clip)");
}
function mousemove(){
    
	var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(OverallData, x0, 1),
            d0 = OverallData[i - 1],
            d1 = OverallData[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

    coordsText.text( 
        timeAnnotation.format()(d.date) + " O:" 
        + ohlcAnnotation.format()(d.open) + " H:" 
        + ohlcAnnotation.format()(d.high) + " L:" 
        + ohlcAnnotation.format()(d.low) + " C:" 
        + ohlcAnnotation.format()(d.close)).style("font-weight","bold");
        svg.select("circle.y")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.close) + ")");

        svg.select("text.y1")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.close) + ")")
            .text(d.close);

        svg.select("text.y2")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.close) + ")")
            .text(d.close);

        svg.select(".x")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.close) + ")")
                       .attr("y2", height - y(d.close));

        svg.select(".y")
            .attr("transform",
                  "translate(" + width * -1 + "," +
                                 y(d.close) + ")")
                       .attr("x2", width + width);
		
}
function hidecoords(){
    coordsText.text("");
}

// this part here is to do the toggle
function updateData(inputval) {
	if(inputval===0){
        svg.select("g.candlestick").datum(OverallData).style("display","none").call(candlestick);
		svg.select("g.close").datum(OverallData).style("display","inline").call(close);
	}
	if(inputval===1){
        svg.select("g.close").datum(OverallData).style("display","none").call(close);
        svg.select("g.candlestick").datum(OverallData).style("display","inline").call(candlestick);
	}
}

function draw() {
	svg.select("g.candlestick").call(candlestick);
	svg.select("g.close").call(close);
	svg.select("g.x.axis").call(xAxis);
	svg.select("g.y.axis").call(yAxis);
	svg.select("g.volume.axis").call(volumeAxis);

	// We know the data does not change, a simple refresh that does not perform data joins will suffice.
	//svg.select("g.candlestick").call(candlestick.refresh);
	svg.select("g.volume").call(volume.refresh);
	svg.select("g.crosshair").call(crosshair);
	
	
	svg.select("g.sma.ma-0").call(sma0);
	svg.select("g.sma.ma-1").call(sma1);
	svg.select("g.ema.ma-2").call(ema2);
	drawVerticalTrendLine();
	
}
function makeLineGraph(){
	d3.csv("./php_scripts/ajax/query/single_company_stocks.php?symbol="+selectedCompany.name, function(error, data) {
		var accessor = candlestick.accessor();

        data = data.map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
				//close: +d.Adj,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        var doma = techan.scale.plot.ohlc(data, accessor).domain();
        OverallData=data;
        minClose = doma[0];
        maxClose = doma[1];
        x.domain(data.map(accessor.d));
        y.domain(doma);
        yVolume.domain(techan.scale.plot.volume(data, accessor.v).domain());
        
        svg.select("g.close").datum(data).style("display","inline").call(close);
        svg.select("g.candlestick").datum(data).style("display","none").call(candlestick);
        svg.select("g.volume").datum(data).style("display","none").call(volume);
		svg.select("g.volume.axis").style("display","none").call(volumeAxis);
		
		/*
		// here is for indicator
		svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).call(sma0);
		svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(20)(data)).call(sma1);
		svg.select("g.ema.ma-2").datum(techan.indicator.ema().period(50)(data)).call(ema2);
		*/
		svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).style("display","none").call(sma0);
		svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(20)(data)).style("display","none").call(sma1);
		svg.select("g.ema.ma-2").datum(techan.indicator.ema().period(50)(data)).style("display","none").call(ema2);
		
        svg.select("g.crosshair").call(crosshair);
		draw();
        
        // Associate the zoom with the scale after a domain has been applied
        zoom.x(x.zoomable()).y(y);
    });
}

function toggleInd(inputval){
	switch(inputval) {
	case 0:
		if(document.getElementById('SMA0').checked){
			//svg.select("g.sma.ma-0").style("display", "none");
			
			svg.select("g.sma.ma-0").style("display", "inline");
		}else{
			
			svg.select("g.sma.ma-0").style("display", "none");
		}
	case 1:
		if(document.getElementById('SMA1').checked){
			//svg.select("g.sma.ma-0").style("display", "none");
			
			svg.select("g.sma.ma-1").style("display", "inline");
		}else{
			
			svg.select("g.sma.ma-1").style("display", "none");
		}
	case 2:
		if(document.getElementById('EMA').checked){
			//svg.select("g.sma.ma-0").style("display", "none");
			
			svg.select("g.ema.ma-2").style("display", "inline");
		}else{
			
			svg.select("g.ema.ma-2").style("display", "none");
		}
	case 3:
		if(document.getElementById('Vol').checked){
			//svg.select("g.sma.ma-0").style("display", "none");
			
			svg.select("g.volume").style("display", "inline");
			svg.select("g.volume.axis").style("display","inline");
		}else{
			
			svg.select("g.volume").style("display", "none");
			svg.select("g.volume.axis").style("display","none");
		}
	}
}

    