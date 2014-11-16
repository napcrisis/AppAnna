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
    <link rel="stylesheet" type="text/css" href="./css/treemap.css">
    <link rel="stylesheet" type="text/css" href="./css/linegraph.css">
    
</head>
<body>
<div>
    <img src="img/appannalogo.png" style="float:left;" height="100"/>

    <div id="legend" class="footer">
        <table>
            <tr>
                <td colspan="3">
                    <img src="./img/legend.jpg" width = "200px"/>
                </td>
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
</div>
<div id="body"></div>
<form></form> <!-- This form tag is required for bpopup if not there will be no overlay-->
<div id="element_to_pop_up">
    <a class="b-close"><img src="./img/cross.png" height="20"/><a/>
    <div id="linebody"></div>
    <div>
        <input type="radio" name="graphtype" id="defaultGraphType" value="line" onclick="updateData(0)" checked>&nbsp;Line&nbsp;
        <input type="radio" name="graphtype" value="candle" onclick="updateData(1)">&nbsp;Candlestick
    </div>
</div>

</body>


<script type="text/javascript" src="./js/treemap_json.js"></script>
<script type="text/javascript" src="./js/linegraph.js"></script>
</html>