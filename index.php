<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <title>App Anna</title>
    <script type="text/javascript" src="./lib/modernizr.js" charset="utf-8"></script>
    <script type="text/javascript" src="./lib/d3.js"></script>
    <script type="text/javascript" src="./lib/jquery-2.1.1.js"></script>
    <script type="text/javascript" src="./lib/jquery.bpopup.min.js"></script>
    <script type="text/javascript" src="./lib/techan.js"></script>
    <script type="text/javascript" src="./lib/bootstrap.js"></script>
	<script type="text/javascript" src="./lib/jquery.autocomplete.min.js"></script>
	<script type="text/javascript" src="./js/search.js"></script>
    <script type='text/javascript'>
        <?php
            // if date is not set, we will have to use 
            if(isset($_GET["daterange"]) && is_numeric($_GET["daterange"])){
                echo "var dateRange = ".$_GET["daterange"].";";
            } else {
                echo "var dateRange = 1;";
            }
        ?>
    </script>

    <link rel="stylesheet" type="text/css" href="./css/treemap.css">
    <link rel="stylesheet" type="text/css" href="./css/linegraph.css">
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="./css/news.css">
	<link rel="stylesheet" type="text/css" href="./css/search.css">
</head>
<body>
    <form></form> <!-- This form tag is required for bpopup if not there will be no overlay-->
    <div>
        <img src="img/appannalogo.png" style="float:left;" height="70"/>

        <div id="legend" class="footer">
            <table>
                <tr>
                    <td colspan="3"><img src="./img/legend.jpg" width = "200px"/></td>
                </tr>
                <tr>
                    <td style="text-align:left; margin:0;" id="minlegend"></td>
                    <td style="text-align:center; margin:0;">0</td>
                    <td style="text-align:right; margin:0;" id="maxlegend"></td>
                </tr>
            </table>
        </div>

        <div id="daterange" class="footer">
            Date Range:
            <div class="btn-group btn-group-xs" role="group">
                <div class="btn-group" role="group">
                    <a href="./index.php?daterange=1"><button type="button" class="btn btn-default" style="text-align:center;" <?php if(!isset($_GET["daterange"]) || $_GET["daterange"]==1){echo "disabled";} ?>>1d</button></a>
                </div>
                <div class="btn-group" role="group">
                    <a href="./index.php?daterange=7"><button type="button" class="btn btn-default" style="text-align:center;" <?php if(isset($_GET["daterange"]) && $_GET["daterange"]==7){echo "disabled";} ?>>7d</button></a>
                </div>
                <div class="btn-group" role="group">
                    <a href="./index.php?daterange=28"><button type="button" class="btn btn-default" style="text-align:center;" <?php if(isset($_GET["daterange"]) && $_GET["daterange"]==28){echo "disabled";} ?>>1m</button></a>
                </div>
                <div class="btn-group" role="group">
                    <a href="./index.php?daterange=182"><button type="button" class="btn btn-default" style="text-align:center;" <?php if(isset($_GET["daterange"]) && $_GET["daterange"]==182){echo "disabled";} ?>>6m</button></a>
                </div>
                <div class="btn-group" role="group">
                    <a href="./index.php?daterange=364"><button type="button" class="btn btn-default" style="text-align:center;" <?php if(isset($_GET["daterange"]) && $_GET["daterange"]==364){echo "disabled";} ?>>1y</button></a>
                </div>
            </div>
			<br><span id="currentdate" style="float:right; margin:0; color: #808080"><i>Current date: </i></span>
        </div>
		
		<div id="companysearch" class="footer">
			<input name="search" id="search" type="text" size="40" placeholder="Search for Company" />
		</div>
		
		<div id="cellsizediv" class="footer">
			Size by:
			<input type="radio" name="cellsize" id="cellsizevol" value="volume" checked>&nbsp;Transacted Volume&nbsp;
             <input type="radio" name="cellsize" id="cellsizecap" value="marketcap">&nbsp;Market Cap
		</div>
		
    </div>
    <div id="body"></div>
    
    <div id="popupElementDiv">
        <a class="b-close"  style="float:right; margin:10px;" ><img src="./img/cross.png"height="20"/></a>
        <div class="row" style="padding-left:30px;">
            <div class="row col-md-12" style=" margin:10px;">
                <div class="row" id="companydisplayinfo"></div>    
            </div>
            <div class="row col-md-8" style="margin-right:20px;">
                <div class="row col-md-12" id="linebody"></div>
                <div class="row col-md-12" id="linecontrols" style="margin-left:30px;">
                    <input type="radio" name="graphtype" id="defaultGraphType" value="line" onclick="updateData(0)" checked>&nbsp;Line&nbsp;
                    <input type="radio" name="graphtype" value="candle" onclick="updateData(1)">&nbsp;Candlestick
                </div>
            </div>
            <div class="row col-md-3" style="margin-right:0px;">
                <ul class="list-group row col-md-12" id="news-list"></ul>    
            </div>            
        </div>
            
    </div>
    <div id="companyInfo">
        <font id="companyName" size="4" color="black">Company Name</font>
        <font size="3" color="gray"> - </font>
        <font id="companySymbol" size="4" color="gray">Company symbol</font><br>
        <font id="companyValue" size="6" color="black">348.48 </font>
        <img src="./img/blueArrow.png" id="postiveIcon" style="width:12px;height:13px"/>
        <img src="./img/orangeArrow.png" id="negativeIcon" style="width:12px;height:13px"/>
        <font id="growthVal" size="4"></font>
        <font id="growthPercent" size="4"></font>
    </div>
	
	<div class="tooltip" id="divt" style="opacity:0"></div>
	<!--divt2 is for displaying the result of company search-->
	<div class="tooltip" id="divt2" style="opacity:0"></div>
</body>


<script type="text/javascript" src="./js/treemap_json.js"></script>
<script type="text/javascript" src="./js/linegraph.js"></script>
</html>