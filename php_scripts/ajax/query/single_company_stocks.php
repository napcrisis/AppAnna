<?php

if(isset($_GET['symbol'])){
	include('../../utility/database.php');
	$sql = "select DATE_FORMAT(Date,'%e-%b-%y') as formatted_date, Open, High, Low, Close, Volume from yahooprices where symbol='".$_GET["symbol"]."' order by Date DESC";

	$result = mysql_query($sql);
	echo "Date,Open,High,Low,Close,Volume";
	while ($r = mysql_fetch_array($result)) {
		echo "\n".$r["formatted_date"].",".$r["Open"].",".$r["High"].",".$r["Low"].",".$r["Close"].",".$r["Volume"];
	}
}