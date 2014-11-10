<?php
if(isset($_GET["tag"])){
	include("../../utility/database.php");
	$sql = "update `news` set tags='".$_GET["tag"]."' where id='".$_GET["newsid"]."'";
	if(mysql_query($sql)){
		echo "Thank you for your input, tag has been added";
	}else{
		echo "Error with adding tag. Please inform us.";	
	}
} else {
	echo "Please input a tag for this article";
}