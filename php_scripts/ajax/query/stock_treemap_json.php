<?php
if(isset($_GET["daysbeforecurrent"]) && is_numeric($_GET["daysbeforecurrent"])){
    include("../../utility/database.php");
    $latestDateSql = "select max(Date) as date from yahooprices;";
    $result = mysql_query($latestDateSql);

    $latestDate = mysql_fetch_row($result);
    $daysBefore = $_GET["daysbeforecurrent"];

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
        $child->company=$r["Companies"];
		$child->dayrange=$r["dayrange"];
		$child->fiftytwowkrange=$r["fiftytwowkrange"];
		$child->avgvol=$r["avgvol"];
		$child->marketcap=$r["marketcap"];
		$child->pe=$r["pe"];
		$child->eps=$r["eps"];
		$child->divandyield=$r["divandyield"];
        $child->volume=$r["Volume"];
        $child->date=$r["Date"];
        $child->low=$r["Low"];
        $child->open=$r["Open"];
        $child->high=$r["High"];
        $child->close=$r["Close"];
        $child->adjclose=$r["Adj Close"];
        $child->netChange=$r["Adj Close"]-$r["beforeAdjClose"];
        $child->percentage=$child->netChange/$r["beforeAdjClose"]*100;
        unset($child->children);
        $industry->children[] = $child;

    }
    $nasdaq = new ind;
    $nasdaq->name = "NASDAQ";
    $nasdaq->children = $industries;
    unset($nasdaq->value);
    print json_encode($nasdaq,JSON_NUMERIC_CHECK);
}
?>