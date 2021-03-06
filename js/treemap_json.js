var supportsForeignObject = Modernizr.svgforeignobject;
var chartWidth = $(window).width();
var chartHeight = $(window).height()-70;
var xscale = d3.scale.linear().range([0, chartWidth]);
var yscale = d3.scale.linear().range([0, chartHeight]);
var headerHeight = 20;
var headerColor = "#555555";
var transitionDuration = 500;
var root;
var node;
var color = d3.scale.category10();
var sizeBy = 0;
var selectedCompany; // LINKAGE TO LINEGRAPH
var sortingByVolume = function(a, b) {  // sorting by name, so that order of cells will be randomly fixed
      if(a.parent && a.parent.depth==0){
        if(b.parent && b.parent.depth==0){
            return a.value < b.value? -1:1;
        }
        return 1;
      } else if (b.parent && b.parent.depth==0){
        return 1;
      }
      return a.volume-b.volume;
    };
var sortingByMarket = function(a, b) {  // sorting by name, so that order of cells will be randomly fixed
      if(a.parent && a.parent.depth==0){
        if(b.parent && b.parent.depth==0){
            return a.value < b.value? -1:1;
        }
        return 1;
      } else if (b.parent && b.parent.depth==0){
        return 1;
      }
      return a.volume-b.volume;
    };
function formatNumber(d) { d3.format(",d");}
var treemap = d3.layout.treemap()
    .round(false)
    .ratio(chartHeight / chartWidth * 0.5 * (1 + Math.sqrt(5)))
    .size([chartWidth, chartHeight])
    .sticky(true)
    .value(function(d) {
        return size(d);
    })
    .mode("squarify") // default
    .sort(sortingByVolume);
var treemapMarket = d3.layout.treemap()
    .round(false)
    .ratio(chartHeight / chartWidth * 0.5 * (1 + Math.sqrt(5)))
    .size([chartWidth, chartHeight])
    .value(function(d) {
        return size(d);
    })
    .mode("squarify") // default
    .sort(sortingByMarket);

var chart = d3.select("#body")
    .append("svg:svg")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .append("svg:g");
	
// traverse and count max min
function traverse(p) {
    if(p.children){ // has children
      var max = -1;
      var min = 1000000;
      for (c in p.children) { // go through all child
        var current = traverse(p.children[c]);
        var curMax = current[1];
        var curMin = current[0];
        if(curMax>max){
          max = curMax;
        }
        if(curMin<min){
          min = curMin;
        }
      }
      return [min,max];
    }
    return [p.percentage,p.percentage];
}      

function getCurrentDate(data) {
	if(data.children){ // has children
      return data.children[0].children[0].date;
    }
    return "";
}        

d3.json("./php_scripts/ajax/query/stock_treemap_json.php?daysbeforecurrent="+dateRange, function(data) {
    node = root = data;
    var nodes = treemap.nodes(root);

    var children = nodes.filter(function(d) {
        return !d.children;
    });
    var parents = nodes.filter(function(d) {
        return d.children;
    });
    var minMax = traverse(data);
	var currentDate = getCurrentDate(data);
	
	//make legend
	var minLegendText = d3.round(minMax[0],2);
    var maxLegendText = d3.round(minMax[1],2);
    d3.select("#minlegend").append("span").html(minLegendText);
    d3.select("#maxlegend").append("span").html(maxLegendText);
	
	//print out current date
	d3.select("#currentdate").append("span").html("<i>"+currentDate+"</i>");
	
	//get colour of the node
	var negSects = (0-minMax[0])/4;
	var posSects = minMax[1]/4; 
	var fillColor = function(d) {
		if(d.percentage < minMax[0]+negSects) {
			return colorScale(1);
		}else if(d.percentage < minMax[0]+(negSects*2)) {
			return colorScale(2);
		}else if(d.percentage < minMax[0]+(negSects*3)) {
			return colorScale(3);
		}else if(d.percentage < 0) {
			return colorScale(4);
		}else if(d.percentage == 0) {
			return colorScale(5);
		}else if(d.percentage < posSects) {
			return colorScale(6);
		}else if(d.percentage < posSects*2) {
			return colorScale(7);
		}else if(d.percentage < posSects*3) {
			return colorScale(8);
		}else {
			return colorScale(9);
		}
	}

	var colorScale = d3.scale.ordinal()
        .range(["#e04810","#f06633","#f48a63","#f7ae92","#BEBEBE","#adcafb","#75a6f8","#508df6","#1869f3"])
		.domain([1,2,3,4,5,6,7,8,9]);
	
    // create parent cells
    var parentCells = chart.selectAll("g.cell.parent")
        .data(parents, function(d) {
            return "p-" + d.name;
        });
    var parentEnterTransition = parentCells.enter()
        .append("g")
        .attr("class", "cell parent")
        .on("click", function(d) {
			zoomo(node === d.parent ? d: root);
        });
    parentEnterTransition.append("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .style("fill", headerColor);
    parentEnterTransition.append('foreignObject')
        .attr("class", "foreignObject")
        .append("xhtml:body")
        .attr("class", "labelbody")
        .append("div")
        .attr("class", "label");
    // update transition
    var parentUpdateTransition = parentCells.transition().duration(transitionDuration);
    parentUpdateTransition.select(".cell")
        .attr("transform", function(d) {
            return "translate(" + d.dx + "," + d.y + ")";
        });
    parentUpdateTransition.select("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .style("fill", headerColor);
    parentUpdateTransition.select(".foreignObject")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", headerHeight)
        .select(".labelbody .label")
        .text(function(d) {
            return d.name;
        });
    // remove transition
    parentCells.exit()
        .remove();

    // create children cells
    var childrenCells = chart.selectAll("g.cell.child")
        .data(children, function(d) {
            return "c-" + d.name;
        });
	
	//div for tooltip
	var divt = d3.select("body").select("#divt");
	
	var vol_format = d3.format("0,000"); 
	
    // enter transition
    var childEnterTransition = childrenCells.enter()
        .append("g")
        .attr("class", "cell child")
		.attr("data-symbol",function(d){
			return d.name;
		})
		.attr("data-company", function(d) {
			return d.company;
		})
		.attr("data-adjclose", function(d) {
			return d.adjclose;
		})
		.attr("data-date", function(d) {
			return d.date;
		})
		.attr("data-netchange", function(d) {
			return d.netChange;
		})
		.attr("data-percentage", function(d) {
			return d.percentage;
		})
		.attr("data-volume", function(d) {
			return d.volume;
		})
		.attr("data-marcap", function(d) {
			return d.marketcap;
		})
        .on("click", function(d) {
            configPopup(d);
            populateNews(d);
        	selectedCompany = d;
            initLineGraph();
        	makeLineGraph();
            $('#popupElementDiv').height((chartHeight-30)+"px");
            $('#popupElementDiv').attr("style","margin-top:50px;");
			$('#popupElementDiv').bPopup({
				appendTo: 'form'
				, zIndex: 2
				, modalClose: true
				, modal: true
				, modalColor : "#000" 
			});

			//remove highlighting and tooltip of selected company
			d3.select("body").select("#divt2").style("opacity", 0);
			d3.select("body").select("#divt").style("display", "");
			$(".child").each(function(){
				$(this).children().last().attr("style","");
			});
			
        })
		.on("mouseover", function(d) {
			this.parentNode.appendChild(this); // workaround for bringing elements to the front (ie z-index)
			d3.select(this)
            .select(".background")
            .style("stroke", "#000000");
			
			divt.transition().duration(200);     
			
			var textToPrint = "";
			var marketcap = d.marketcap; 
			
			if(d.netChange > 0 ){
				textToPrint = "<font size='4px'><b>" + d.company + " (" + d.name + ")</b></font>" + "<br><font size='5px' color='#606060'><b>USD $" + d.adjclose + "</b></font><br>Net Change: <img src='./img/blueArrow.png' style='width:12px;height:13px'> <font color='#1869f3'><b>" + d3.round(d.netChange,2) + "  (" + d3.round(d.percentage,2) +"%)</b></font><br>Volume: " + vol_format(d.volume) + "<br>Market Cap: " + d.marketcap+"<br><font color='#808080'><i>(Click cell for more details)</i></font>";
			} else if (d.netChange == 0 ){
				textToPrint = "<font size='4px'><b>" + d.company + " (" + d.name + ")</b></font>" + "<br><font size='5px' color='#606060'><b>USD $" + d.adjclose + "</b></font> <br>Net Change: <b>" + d3.round(d.netChange,2) + "  (" + d3.round(d.percentage,2) + "%)</b><br>Volume: " + vol_format(d.volume) + "<br>Market Cap: " + d.marketcap+"<br><font color='#808080'><i>(Click cell for more details)</i></font>";
			} else {
				textToPrint = "<font size='4px'><b>" + d.company + " (" + d.name + ")</b></font>" + "<br><font size='5px' color='#606060'><b>USD $" + d.adjclose + "</b></font> <br>Net Change: <img src='./img/orangeArrow.png' style='width:12px;height:13px'> <font color='#e04810'><b>" + d3.round(d.netChange,2) + "  (" + d3.round(d.percentage,2) + "%)</b></font><br>Volume: " + vol_format(d.volume) + "<br>Market Cap: " + d.marketcap+ "<br><font color='#808080'><i>(Click cell for more details)</i></font>";
			}
			
			//this section flips the tooltip if it's nearing the edge
			var xpos = d3.event.pageX;
			if(d3.event.pageX >= chartWidth - 230) {
				xpos = d3.event.pageX - 230;
			}
			var ypos = d3.event.pageY;
			if(d3.event.pageY >= chartHeight - 130) {
				ypos = d3.event.pageY - 130;
			}
			
			divt.html(textToPrint)
			.style("left", xpos + "px")     
			.style("top", ypos + "px")
			.style("opacity", 1);   
		})
		.on("mouseout", function(d) {
			d3.select(this)
            .attr("filter", "")
            .select(".background")
            .style("stroke", "#FFFFFF");
			
			divt.transition()        
			.duration(500)      
			.style("opacity", 0);   
		});
		
    childEnterTransition.append("rect")
        .classed("background", true)
        .style("fill", function(d) {
            return fillColor(d);
        });
    childEnterTransition.append('foreignObject')
        .attr("class", "foreignObject")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", function(d) {
            return Math.max(0.01, d.dy);
        })
        .append("xhtml:body")
        .attr("class", "labelbody")
        .append("div")
        .attr("class", "label");

    if (supportsForeignObject) {
        childEnterTransition.selectAll(".foreignObject")
            .style("display", "none");
    } else {
        childEnterTransition.selectAll(".foreignObject .labelbody .label")
            .style("display", "none");
    }

    // update transition
    var childUpdateTransition = childrenCells.transition().duration(transitionDuration);
    childUpdateTransition.select(".cell")
        .attr("transform", function(d) {
            return "translate(" + d.x  + "," + d.y + ")";
        });
    childUpdateTransition.select("rect")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", function(d) {
            return d.dy;
        })
        .style("fill", function(d) {
            return fillColor(d);
        });
    childUpdateTransition.select(".foreignObject")
        .attr("width", function(d) {
            return Math.max(0.01, d.dx);
        })
        .attr("height", function(d) {
            return Math.max(0.01, d.dy);
        });
    // exit transition
    childrenCells.exit()
        .remove();

	//this section is for changing how the cells are sized
    d3.select("#cellsizecap").on("click", function() { //if market cap is selected
		treemapMarket
            .sticky(false)
            .value(this.value == "volume" ? size : count)
            .nodes(root);

        zoomo(node);
	});
	
	d3.select("#cellsizevol").on("click", function() { //if volume is selected
		treemap
            .sticky(false)
            .value(this.value == "volume" ? size : count)
            .nodes(root);
        treemap
            .sticky(true);
        zoomo(node);
	});
	
    zoomo(node);
});

function size(d) {
	if (sizeBy ==0) { //if default or volume is selected
		return d.volume;
	}else{ //if market cap is selected
		var marketcap = d.marketcap;
		var marketcapno = marketcap.substring(0, marketcap.length - 2);
		if(marketcap.indexOf("M") != -1) {
			marketcapno = d3.round(marketcapno,0);
		} else if(marketcap.indexOf("B") != -1) {
			marketcapno = d3.round(marketcapno*1000,0);
		} else {
			marketcapno = 0;
		}
		return marketcapno;
	}
}


function count(d) {
    //return 1;
	var marketcap = d.marketcap;
	var marketcapno = marketcap.substring(0, marketcap.length - 2);
	if(marketcap.indexOf("M") != -1) {
		marketcapno = d3.round(marketcapno,0);
	} else if(marketcap.indexOf("B") != -1) {
		marketcapno = d3.round(marketcapno*1000,0);
	} else {
		marketcapno = 0;
	}
	return marketcapno;
}


//and another one
function textHeight(d) {
    var ky = chartHeight / d.dy;
    yscale.domain([d.y, d.y + d.dy]);
    return (ky * d.dy) / headerHeight;
}


function getRGBComponents (color) {
    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}


function idealTextColor (bgColor) {
    var nThreshold = 105;
    var components = getRGBComponents(bgColor);
    var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}


function zoomo(d) {
    this.treemap
        .padding([headerHeight/(chartHeight/d.dy), 0, 0, 0])
        .nodes(d);
    // moving the next two lines above treemap layout messes up padding of zoomo result
    var kx = chartWidth  / d.dx;
    var ky = chartHeight / d.dy;
    var level = d;

    xscale.domain([d.x, d.x + d.dx]);
    yscale.domain([d.y, d.y + d.dy]);

    if (node != level) {
        if (supportsForeignObject) {
            chart.selectAll(".cell.child .foreignObject")
                .style("display", "none");
        } else {
            chart.selectAll(".cell.child .foreignObject .labelbody .label")
                .style("display", "none");
        }
    }

    var zoomoTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
        .attr("transform", function(d) {
            return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")";
        })
        .each("end", function(d, i) {
            if (!i && (level !== self.root)) {
                chart.selectAll(".cell.child")
                    .filter(function(d) {
                        return d.parent === self.node; // only get the children for selected group
                    })
                    .select(".foreignObject .labelbody .label");

                if (supportsForeignObject) {
                    chart.selectAll(".cell.child")
                        .filter(function(d) {
                            return d.parent === self.node; // only get the children for selected group
                        })
                        .select(".foreignObject")
                        .style("display", "");
                } else {
                    chart.selectAll(".cell.child")
                        .filter(function(d) {
                            return d.parent === self.node; // only get the children for selected group
                        })
                        .select(".foreignObject .labelbody .label")
                        .style("display", "");
                }
            }
        });

    zoomoTransition.select(".foreignObject")
        .attr("width", function(d) {
            return Math.max(0.01, kx * d.dx);
        })
        .attr("height", function(d) {
            return d.children ? headerHeight: Math.max(0.01, ky * d.dy);
        });

    // update the width/height of the rects
    zoomoTransition.select("rect")
        .attr("width", function(d) {
            return Math.max(0.01, kx * d.dx);
        })
        .attr("height", function(d) {
            return d.children ? headerHeight : Math.max(0.01, ky * d.dy);
        });

    node = d;

    if (d3.event) {
        d3.event.stopPropagation();
    }
}

function updateTreemap(val) {
	//for changing size of treemap. 0 for volume, 1 for market cap
	if(val==0) {
		sizeBy = 0;
	}else if(val==1) {
		sizeBy = 1;
	}else {
		sizeBy = 0;
	}
}
