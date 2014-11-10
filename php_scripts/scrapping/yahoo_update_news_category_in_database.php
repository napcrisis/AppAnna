<?php
// grab content & category
include("../utility/database.php");
$content = '/<div class="news_detail" >\s*<div>(.*?)<\/div\s?>/';
$category = '/<ul class="breadcrumbs-top">\s*<li><a href="[^"]*" title="([^"]*)">/';

$sql = "SELECT * FROM `news` where category='' or content=''";
$result = mysql_query($sql);
while ($row = mysql_fetch_array($result)) {
	$news = file_get_contents($row["url"]);
	preg_match_all($category,$news,$categoryarray);
	preg_match_all($content,$news,$contentarray);
	$cat = $categoryarray[1];

	$con = $contentarray[1];
	$contentofthisnews = str_replace("'", '%27', $con[0]);
	$update_sql = "UPDATE `newssources`.`news` SET `category` = '".$cat[0]."', `content`='".$contentofthisnews."' WHERE `news`.`title` = '".$row["title"]."';";
	mysql_query($update_sql);
}
?>
