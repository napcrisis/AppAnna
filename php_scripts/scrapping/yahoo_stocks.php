<?php
	include("../utility/database.php");
	// $latestDateInDatabase = "Select DATEDIFF('".date("Y-m-d")."',max(Date)),max(Date) from yahooprices group by Symbol limit 1";
	// $dateresult = mysql_query($latestDateInDatabase);
	// $dateFromDB = mysql_fetch_array($dateresult);
	// $latestDate = $dateFromDB[0];
	// $earliestDate = $dateFromDB[1];
	// if(!($latestDate>0)){
	// 	echo "latest alr".$latestDate;
	// 	die();
	// }
	// $endDate = explode("-",date("Y-m-d"));
	// $endYear = $endDate[0];
	// $endMonth = $endDate[1]-1;
	// $endDay = $endDate[2];

	// $startDate = explode("-",$earliestDate );
	// $startYear = $startDate[0];
	// $startMonth = $startDate[1]-1;
	// $startDay = $startDate[2];


	$selectSql = 'select `Symbol` from listedcompanies';
	$prefix = "http://real-chart.finance.yahoo.com/table.csv?s=";
	// $postfix = "&a=".$startMonth."&b=".$startDay."&c=".$startYear."&d=".$endMonth."&e=".$endDay."&f=".$endYear."&g=d&ignore=.csv";
	// correct: d=10&e=17&f=2014&g=d&a=11&b=12&c=1980&ignore=.csv
	$result = mysql_query($selectSql);
	$postfix = "&d=10&e=17&f=2014&g=d&a=11&b=12&c=1980&ignore=.csv";
	while ($row = mysql_fetch_array($result)) {
		echo $url = $prefix. $row[0].$postfix;
		$csv = file_get_contents($url);
		$lines = explode("\n",$csv);
		$first = 1;
		set_time_limit(10);
		foreach($lines as $line){
			if($first==1){
				$first=0;
			} else {
				$parts = explode(",",$line);
				$symbol = $row[0];
				$date = $parts[0];
				if($date!=""){
					$open = $parts[1];
					$high = $parts[2];
					$low = $parts[3];
					$close = $parts[4];
					$volume = $parts[5];
					$adjclose = $parts[6];
					$insert_sql = "INSERT INTO `newssources`.`yahooprices` VALUES ('".$symbol."','".$date."', '".$open."', '".$high."', '".$low."', '".$close."', '".$volume."', '".$adjclose."');";
					mysql_query($insert_sql);
				}
			}
		}
	}
?>