
<html>
<body>
<form method="post">
	<input style="width:100%;" type="text" name="url" value="http://www.channelnewsasia.com/archives/4616/Technology/months/latest/0"/>
	<input type="submit">
</form><br>
<?php 
	if(isset($_POST["url"])){
		include("../utility/database.php");
		$pattern = '/<div class="date-box">\s*<span class="date">([^<]*)<\/span>\s*<span class="day">[^<]*<\/span>\s*<\/div>\s*<div class="img">\s*<a href="([^"]*)" title="([^"]*)">[^<]*<img[^>]*>\s*<\/a>\s*<\/div>\s*<div class="txt-box">\s*<h2><a[^>]*>[^<]*<\/a><\/h2>\s*<p>([^<]*)/';
		$url = $_POST["url"];
		$prefixurl = "http://www.channelnewsasia.com/";
		$news = file_get_contents($url);
		$news = str_replace('<span class="ico-video">Video </span>', '', $news);
		echo "<br>query from url complete :".$url;
		preg_match_all($pattern,$news,$outarray);
		echo "<br>matched ".count($outarray[1]) ." entries in URL";
		$datearr = $outarray[1];
		$urlarr = $outarray[2];
		$titlearr = $outarray[3];
		$descriptionarr = $outarray[4];
		for($x=0;$x<count($outarray[1]);$x++){
			$date = trim($datearr[$x]);
			$title = trim($titlearr[$x]);
			$url = $prefixurl.trim($urlarr[$x]);
			$description = trim($descriptionarr[$x]);
			$insert_sql = "INSERT INTO `newssources`.`news` (`date`, `description`, `title`, `url`) VALUES ('".date("Y-m-d",strtotime($date))."', '".$description."', '".$title."', '".$url."');";
			echo "<br>Results ".(mysql_query($insert_sql)==1?"Success":"Already inside")."<br>";
		}	
	}
?>
</body>
</html>
