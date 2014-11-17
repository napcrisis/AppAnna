<?php
include("../utility/database.php");
$allCompanies = "select symbol from `listedcompanies`";
$result = mysql_query($allCompanies);
while ($row = mysql_fetch_array($result)) {
	set_time_limit(30);
	$symbol = $row[0];
	$regx = '/<h3><span>[^<]*<\/span><\/h3><ul>(<li><a href="([^"]*)">([^<]*)<\/a><cite>([^<]*)<span>[^<]*<\/span><\/cite><\/li>)*<\/ul>/';
	$url = "http://finance.yahoo.com/q/p?s=".$symbol;

	$input_lines = file_get_contents($url);
	preg_match_all($regx, $input_lines, $output_array);

	$dateregx = "/<h3><span>([^<]*)<\/span><\/h3>/";
	$newsregx = '/<li><a href="([^"]*)">([^<]*)<\/a><cite>([^<]*)<span>[^<]*<\/span><\/cite><\/li>/';
	$failure = 0;
	for($x=0;$x<count($output_array[0]);$x++){
		preg_match_all($dateregx, $output_array[0][$x], $date_array);
		$strDate = date("Y-m-d",strtotime($date_array[1][0]));
		preg_match_all($newsregx, $output_array[0][$x], $news_array);		
		for($y=0;$y<count($news_array[1]);$y++){
			$insert_sql = "INSERT INTO `newssources`.`yahoorss` (`date`,`symbol`,`link`,`source`,`headline`) VALUES ";
			$link = $news_array[1][$y];
			$headline = str_replace("'","&#39;",$news_array[2][$y]);
			$source = $news_array[3][$y];
			$row = "('".$strDate."','".$symbol."','".$link."','".$source."','".$headline."')";
			$insert_sql.=$row;
			if(mysql_query($insert_sql)){
				echo $insert_sql;
			}
		}	
	}
}

?>