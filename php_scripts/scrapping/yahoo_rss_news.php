<?php
	include("../utility/database.php");
	$allCompanies = "select symbol from `listedcompanies`";
	$result = mysql_query($allCompanies);
	while ($row = mysql_fetch_array($result)) {
		set_time_limit(30);
		$symbol = $row[0];
		$rss = "http://feeds.finance.yahoo.com/rss/2.0/headline?s=".$symbol."&region=US&lang=en-US";
		$xmlnews = simplexml_load_file($rss);
		
		for($index=0;$index<count($xmlnews->channel->item);$index++){
			$insert_sql = "INSERT INTO `newssources`.`yahoorealrss` (`link`, `title`, `datetime`,`guid`,`symbol`) VALUES ";
			$newsitem = $xmlnews->channel->item[$index];
			$dateandtime = date("Y-m-d h:m:s",strtotime($newsitem->pubDate));
			$guid = $newsitem->guid;
			$title = mysql_real_escape_string($newsitem->title);
			$link = $newsitem->link;
			$row = "('".$link."', '".$title."', '".$dateandtime."','".$guid."','".$symbol."')";
			$insert_sql.=$row;
			$failure = mysql_query($insert_sql)>0?0:1;	
			if($failure){
				echo $insert_sql;
			}	
		}
	}
?>

