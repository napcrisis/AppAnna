<?php
	include("../utility/database.php");
	$allCompanies = "select symbol from `listedcompanies`";
	$result = mysql_query($allCompanies);
	while ($row = mysql_fetch_array($result)) {
		set_time_limit(30);
		$symbol = $row[0];
		$rss = "http://feeds.finance.yahoo.com/rss/2.0/headline?s=".$symbol."&region=US&lang=en-US";
		$xmlnews = simplexml_load_file($rss);
		$insert_sql = "INSERT INTO `newssources`.`yahoorealrss` (`link`, `title`, `datetime`,`guid`) VALUES ";

		for($index=0;$index<count($xmlnews->channel->item);$index++){
			$newsitem = $xmlnews->channel->item[$index];
			$dateandtime = date("Y-m-d h:m:s",strtotime($newsitem->pubDate));
			$guid = $newsitem->guid;
			$title = mysql_real_escape_string($newsitem->title);
			$link = $newsitem->link;
			$row = "('".$link."', '".$title."', '".$dateandtime."','".$guid."'),";
			$insert_sql.=$row;
		}
		$sql = trim($insert_sql, ",");
		mysql_query($sql);
		$failure = $failure + mysql_query($insert_sql)>0?0:1;		
		echo " Ran with ".$failure." failures for ".$symbol . ", count ".count($xmlnews->channel->item);
	}

?>

