<?php
include("../../utility/database.php");
$sql = "select * from 
(select latest.Symbol, latestclose-oldestclose as changesoverperiod, (latestclose-oldestclose)/oldestclose as percentagechange from 
(select Symbol, Close as latestclose from yahooprices where Date =(select Max(Date) from yahooprices group by Symbol limit 1) group by Symbol) as latest inner join 
(select Symbol, Close as oldestclose from yahooprices where Date =(select Min(Date) from yahooprices group by Symbol limit 1) group by Symbol) as early on early.Symbol = latest.Symbol) as agg, 
(select y.Symbol, Date, Sector,Industry, Companies, Low, High, Close, Volume from `listedcompanies` l inner join `yahooprices` y on l.Symbol=y.Symbol where Date=(select Max(Date) from yahooprices group by Symbol limit 1)) as la where la.Symbol = agg.Symbol;";
$result = mysql_query($sql);
$industries = [];
class ind{
	public $name="";
	public $children = [];
	public $value;
}
while ($r = mysql_fetch_array($result)) {
	$industry = "";
    foreach($industries as $i){
    	if($i->name==$r["Sector"]){
    		$industry = $i;
    		break;
    	} 
    }
    if($industry==""){
		$industry = new ind;
		$industry->name = $r["Sector"];
		unset($industry->value);
		$industries[] = $industry;
    }
    $child = new ind;
    $child->name=$r["Symbol"];
    $child->company=$r["Companies"];
    $child->changesoverperiod=$r["changesoverperiod"];
    $child->value=$r["Volume"];
    $child->Date=$r["Date"];
    $child->Low=$r["Low"];
    $child->High=$r["High"];
    $child->Close=$r["Close"];
    unset($child->children);
    $industry->children[] = $child;

}
$nasdaq = new ind;
$nasdaq->name = "nasdaq";
$nasdaq->children = $industries;
unset($nasdaq->value);
print json_encode($nasdaq,JSON_NUMERIC_CHECK);
?>