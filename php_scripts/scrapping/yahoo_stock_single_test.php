<?php
if(isset($_POST["stock"]) && count($_POST["stock"])<10){
	include("../utility/database.php");
	
	$prefix = "http://real-chart.finance.yahoo.com/table.csv?s=";
	$postfix = "&a=02&b=27&c=2013&d=09&e=13&f=2014&g=d&ignore=.csv";
	$url = $prefix. $_POST["stock"].$postfix;
	$csv = file_get_contents($url);
	$lines = explode("\n",$csv);
	$first = 1;
	var_dump($csv);
	foreach($lines as $line){
		if($first==1){
			$first=0;
		} else {
			$parts = explode(",",$line);
			$symbol = $_POST["stock"];
			$date = $parts[0];
			if($date!=""){
				$open = $parts[1];
				$high = $parts[2];
				$low = $parts[3];
				$close = $parts[4];
				$volume = $parts[5];
				$adjclose = $parts[6];
				echo $insert_sql = "INSERT INTO `newssources`.`yahooprices` VALUES ('".$symbol."','".$date."', '".$open."', '".$high."', '".$low."', '".$close."', '".$volume."', '".$adjclose."');";
				echo "<br>Results ".(mysql_query($insert_sql)==1?"Success":"Already inside")."<br>";
			}
		}
	}
}
?>
<html>
	<body>
		<form method="post">
			<input type="text" name="stock"/>
			<input type="submit">
		</form>
	</body>
</html>