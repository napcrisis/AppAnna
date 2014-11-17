<?php
$filter = "";
if(isset($_GET["symbol"])){
	include("../../utility/database.php");
	$sql = "SELECT * FROM `yahoorss` where symbol='".$_GET["symbol"]."' ORDER BY `yahoorss`.`date` DESC";
	$result = mysql_query($sql);
	$rows = [];
	while ($r = mysql_fetch_array($result)) {
	    $rows[] = $r;
	}
	print json_encode($rows);
} else {
	echo "You did not provide stock symbol";
}
?>