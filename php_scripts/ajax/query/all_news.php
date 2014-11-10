<?php
$filter = "";
if(isset($_GET["filter"])){
	$filter = "where ";
	$filter .= "(title like '%".$_GET["filter"]."%' or description like '%".$_GET["filter"]."%')";
}
if(isset($_GET["newscategory"])){
	if(!isset($_GET["filter"])){
		$filter = "where ";
	}else{
		$filter .= " and ";
	}
	$filter .= "category='".$_GET["newscategory"]."'";
}
include("../../utility/database.php");
$sql = "SELECT * FROM `news` ".$filter." ORDER BY `news`.`date` DESC";
$result = mysql_query($sql);
$rows = [];
while ($r = mysql_fetch_array($result)) {
    $rows[] = $r;
}
print json_encode($rows);
?>