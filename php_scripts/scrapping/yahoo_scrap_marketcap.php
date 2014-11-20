<?php
// grab content & category
include("../utility/database.php");
$content = "/<table id=\"table2\"><tr><th scope=\"row\" width=\"48%\">Day's Range:<\/th><td class=\"yfnc_tabledata1\"><span><span id=\"[^\"]*\">([^<]*)<\/span><\/span> - <span><span id=\"[^\"]*\">([^<]*)<\/span><\/span><\/td><\/tr><tr><th scope=\"row\" width=\"48%\">52wk Range:<\/th><td class=\"yfnc_tabledata1\"><span>([^<]*)<\/span> - <span>([^<]*)<\/span><\/td><\/tr><tr><th scope=\"row\" width=\"48%\">Volume:<\/th><td class=\"yfnc_tabledata1\"><span id=\"[^\"]*\">([^<]*)<\/span><\/td><\/tr><tr><th scope=\"row\" width=\"48%\">Avg Vol <span class=\"small\">\(3m\)<\/span>:<\/th><td class=\"yfnc_tabledata1\">([^<]*)<\/td><\/tr><tr><th scope=\"row\" width=\"48%\">Market Cap:<\/th><td class=\"yfnc_tabledata1\">(N\/A|<span id=\"[^\"]*\">([^<]*)<\/span>)<\/td><\/tr><tr><th scope=\"row\" width=\"48%\">P\/E <span class=\"small\">\(ttm\)<\/span>:<\/th><td class=\"yfnc_tabledata1\">([^<]*)<\/td><\/tr><tr><th scope=\"row\" width=\"48%\">EPS <span class=\"small\">\(ttm\)<\/span>:<\/th><td class=\"yfnc_tabledata1\">([^<]*)<\/td><\/tr><tr class=\"end\"><th scope=\"row\" width=\"48%\">Div &amp; Yield:<\/th><td class=\"yfnc_tabledata1\">([^<]*)<\/td><\/tr><\/table>/";
$url = "http://finance.yahoo.com/q?s=";
$sql = "SELECT Symbol from listedcompanies where volume IS NULL or volume = '';";
$result = mysql_query($sql);
while ($row = mysql_fetch_array($result)) {
	set_time_limit(30);
	$news = file_get_contents($url . $row["Symbol"]);
	preg_match_all($content,$news,$contentarray);
	$x = 8;
	if($contentarray[8][0]==""){
		$x = 9;
	}
	$update_sql = "UPDATE `newssources`.`listedcompanies` SET 
	`dayrange` = '".$contentarray[1][0]."-".$contentarray[2][0]."', 
	`fiftytwowkrange` = '".$contentarray[3][0]."-".$contentarray[4][0]."',
	`volume` = '".$contentarray[5][0]."', 
	`avgvol` = '".$contentarray[6][0]."', 
	`marketcap` = '".$contentarray[7][0]."', 
	`pe` = '".$contentarray[$x][0]."', 
	`eps` = '".$contentarray[$x+1][0]."', 
	`divandyield` = '".$contentarray[$x+2][0]."'
	WHERE `symbol` = '".$row["Symbol"]."';";
	mysql_query($update_sql);
}
?>
