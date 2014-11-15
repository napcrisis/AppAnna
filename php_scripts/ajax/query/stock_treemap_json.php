<?php
include("../../utility/database.php");
$latestDateSql = "select max(Date) as date from yahooprices;";
$result = mysql_query($latestDateSql);

$latestDate = mysql_fetch_row($result);
$daysBefore = 1;

$sql = "select * from 
(select Symbol as afterSymbol, Date, Open, High, Low, Close, Volume, `Adj Close` from yahooprices where Date='".$latestDate[0]."') as current,
(select Symbol as beforeSymbol, Date as beforeDate, Open as beforeOpen, High as beforeHigh, Low as beforeLow, Close as beforeClose, Volume 
    as beforeVolume, `Adj Close` as beforeAdjClose from yahooprices where Date=DATE_SUB('".$latestDate[0]."', INTERVAL ".$daysBefore." DAY)) as bef, `listedcompanies`
where afterSymbol=beforeSymbol and afterSymbol = Symbol;";

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
    $child->Open=$r["Open"];
    $child->netChange=$r["Adj Close"]-$r["beforeAdjClose"];
    $child->percentage=$r["Adj Close"]-$r["beforeAdjClose"];
    unset($child->children);
    $industry->children[] = $child;

}
$nasdaq = new ind;
$nasdaq->name = "nasdaq";
$nasdaq->children = $industries;
unset($nasdaq->value);
print json_encode($nasdaq,JSON_NUMERIC_CHECK);
?>