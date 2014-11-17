<?php
error_reporting(E_ALL ^ E_DEPRECATED);
    $connect=mysql_connect("localhost","root","") or die("Unable to Connect");
    mysql_select_db("newssources") or die("Could not open the db");
?>