<?php

if(isset($_GET['symbol'])){
	include('../../utility/database.php');
	$sql = "select DATE_FORMAT(Date,'%d-%b-%y') as formatted_date, Open, High, Low, Close, Volume from yahooprices where symbol='".$_GET["symbol"]."'";

	$result = mysql_query($sql);
	echo "Date,Open,High,Low,Close,Volume\n";
	while ($r = mysql_fetch_array($result)) {
		echo $r["formatted_date"].",".$r["Open"].",".$r["High"].",".$r["Low"].",".$r["Close"].",".$r["Volume"]."\n";
	}
}