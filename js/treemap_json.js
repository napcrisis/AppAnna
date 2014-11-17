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

var selectedCompany; // LINKAGE TO LINEGRAPH

function formatNumber(d) { d3.format(",d");}
var treemap = d3.layout.treemap()
    .round(false)
    .size([chartWidth, chartHeight])
    .sticky(true)
    .mode("squarify")
    .ratio(.8 * (1 + Math.sqrt(20))) // changing this allow us to modify slightly the outcome of squarify algo
    .sort(function(a, b) {  // sorting by name, so that order of cells will be randomly fixed
      if ( a.name < b.name )
        return -1;
      if ( a.name > b.name )
        return 1;
      return 0; })
    .value(function(d) {
        return size(d);
    });

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

d3.json("./php_scripts/ajax/query/stock_treemap_json.php", function(data) {
    node = root = data;
    var nodes = treemap.nodes(root);

    var children = nodes.filter(function(d) {
        return !d.children;
    });
    var parents = nodes.filter(function(d) {
        return d.children;
    });

    var minMax = traverse(data);
	var minLegendText = d3.round(minMax[0],2);
    var maxLegendText = d3.round(minMax[1],2);
    d3.select("#minlegend").append("span").html(minLegendText);
    d3.select("#maxlegend").append("span").html(maxLegendText);
	
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
		.range(["#cb181d","#fb6a4a","#fcae91","#fee5d9","#ffffff","#bae4b3","#74c476","#31a354","#006d2c"])
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
			zoom(node === d.parent ? d: root);
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
	var divt = d3.select("body").append("divt")
	.attr("class", "tooltip")
	.style("opacity", 0);
	
	var vol_format = d3.format("0,000"); 
	
    // enter transition
    var childEnterTransition = childrenCells.enter()
        .append("g")
        .attr("class", "cell child")
        .on("click", function(d) {
            configPopup(d);
            populateNews(d);
        	selectedCompany = d;
            initLineGraph();
        	makeLineGraph();
			$('#popupElementDiv').bPopup({
				appendTo: 'form'
				, zIndex: 2
				, modalClose: true
				, modal: true
				, modalColor : "#000" 
			});
        })
		.on("mouseover", function(d) {
			this.parentNode.appendChild(this); // workaround for bringing elements to the front (ie z-index)
			d3.select(this)
            .select(".background")
            .style("stroke", "#000000");
			
			divt.transition().duration(200);     
			
			var textToPrint = "";

			if(d.netChange > 0 ){
				textToPrint = "<font size='4px'><b>" + d.company + " (" + d.name + ")</b></font>" + "<br><font size='3px' color='#606060'><b>$" + d.adjclose + "</b></font>   <i>"+ d.date + "</i><br>Net Change: <font color='green'><b>" + d3.round(d.netChange,2) + "  " + d3.round(d.percentage,2) + "%</b></font><br>Volume: " + vol_format(d.volume) + "<br><i>(Click for more details)</i>";
			} else {
				textToPrint = "<font size='4px'><b>" + d.company + " (" + d.name + ")</b></font>" + "<br><font size='3px' color='#606060'><b>$" + d.adjclose + "</b></font>   <i>"+ d.date + "</i><br>Net Change: <font color='red'><b>" + d3.round(d.netChange,2) + "  " + d3.round(d.percentage,2) + "%</b></font><br>Volume: " + vol_format(d.volume) + "<br><i>(Click for more details)</i>";
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

    d3.select("select").on("change", function() {
        treemap.value(this.value == "size" ? size : count)
            .nodes(root);
        zoom(node);
    });

    zoom(node);
});


function size(d) {
    return d.volume;
}


function count(d) {
    return 1;
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


function zoom(d) {
    this.treemap
        .padding([headerHeight/(chartHeight/d.dy), 0, 0, 0])
        .nodes(d);

    // moving the next two lines above treemap layout messes up padding of zoom result
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

    var zoomTransition = chart.selectAll("g.cell").transition().duration(transitionDuration)
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

    zoomTransition.select(".foreignObject")
        .attr("width", function(d) {
            return Math.max(0.01, kx * d.dx);
        })
        .attr("height", function(d) {
            return d.children ? headerHeight: Math.max(0.01, ky * d.dy);
        });

    // update the width/height of the rects
    zoomTransition.select("rect")
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