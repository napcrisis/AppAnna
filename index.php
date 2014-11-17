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

    <link rel="stylesheet" type="text/css" href="./css/treemap.css">
    <link rel="stylesheet" type="text/css" href="./css/linegraph.css">
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="./css/news.css">
	<link rel="stylesheet" type="text/css" href="./css/search.css">
</head>
<body>
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
            <input type="radio" class="daterange" name="daterange" value="1" checked>1 Day
            <input type="radio" class="daterange" name="daterange" value="7">1 Week
            <input type="radio" class="daterange" name="daterange" value="30">1 Month 
            <input type="radio" class="daterange" name="daterange" value="180">6 Months
            <input type="radio" class="daterange" name="daterange" value="365">1 Year
        </div>
		
		<div id="companysearch" class="footer">
			<form><input name="search" id="search" type="text" size="40" placeholder="Search for Company" /></form>
		</div>
		
    </div>
    <div id="body"></div>
    <form></form> <!-- This form tag is required for bpopup if not there will be no overlay-->
    <div id="popupElementDiv">
        <a class="b-close"><img src="./img/cross.png" height="20" style="margin:5px;"/></a>
        <div id="linebody"></div>
        <div style="margin-left:30px;">
            <input type="radio" name="graphtype" id="defaultGraphType" value="line" onclick="updateData(0)" checked>&nbsp;Line&nbsp;
            <input type="radio" name="graphtype" value="candle" onclick="updateData(1)">&nbsp;Candlestick
        </div>
        <div class="row">
            <ul class="list-group col-md-5" id="news-list"></ul>
            <div class="col-md-6" id="news-description">
            </div>
        </div>
    </div>
    <div id="companyInfo">
        <font id="companyName" size="4" color="black">Company Name</font>
        <font size="3" color="gray"> - </font>
        <font id="companySymbol" size="4" color="gray">Company symbol</font><br>
        <font id="companyValue" size="6" color="black">348.48 </font>
        <img src="./img/editedGreenArrow.png" id="postiveIcon" style="width:12px;height:13px"/>
        <img src="./img/editedRedArrow.png" id="negativeIcon" style="width:12px;height:13px"/>
        <font id="growthVal" size="4"></font>
        <font id="growthPercent" size="4"></font>
    </div>
</body>


<script type="text/javascript" src="./js/treemap_json.js"></script>
<script type="text/javascript" src="./js/linegraph.js"></script>
</html>