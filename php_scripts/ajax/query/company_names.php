<?php
include("../../utility/database.php");
$sql = "select companies,symbol from listedcompanies;";
$result = mysql_query($sql);

class company{
}
 $companies = [];

while ($r = mysql_fetch_array($result)) {

	$coy = new company;
	$coy->value = $r["companies"]." (".$r["symbol"].")";
	$coy->data=$r["symbol"];
	$companies[] = $coy;
}
print json_encode($companies,JSON_NUMERIC_CHECK);
?>