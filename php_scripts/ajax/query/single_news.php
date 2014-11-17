<?php
// news ajax
if(isset($_GET["newsid"])){
	include("../../utility/database.php");
	$sql = "SELECT * FROM `yahoorss` where id='".$_GET["newsid"]."'";
	$result = mysql_query($sql);
	while ($r = mysql_fetch_array($result)) {
		print json_encode($r);
		break;
	}
}
?>