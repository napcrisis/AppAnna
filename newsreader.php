<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Team IS428</title>
		<script type="text/javascript" src="lib/d3.js"></script>
		<script type="text/javascript" src="lib/jquery-1.11.1.js"></script>
		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script src="lib/bootstrap.min.js"></script>
		<!-- Bootstrap -->
		<link href="css/bootstrap.min.css" rel="stylesheet">
	</head>
	<body>
		<div class="page-header">
			<h1>Project IS428 <small>Team Nil</small></h1>
		</div>
		<div class="container-fluid">
			<div class="row">
  				<div class="col-md-4">
  					<h2>News Reader</h2>

					<div class="input-group">
					  <input type="text" class="form-control" id="newssearch">
					  <div class="input-group-btn">
					  	<button class="btn btn-default dropdown-toggle" type="button" id="newscategory" data-toggle="dropdown">
					    All news
					  </button>
					  <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
					    <li role="presentation" class="newscategory" value="World"><a role="menuitem" tabindex="-1" href="#">World</a></li>
					    <li role="presentation" class="newscategory" value="Business"><a role="menuitem" tabindex="-1" href="#">Business</a></li>
					    <li role="presentation" class="newscategory" value="Technology"><a role="menuitem" tabindex="-1" href="#">Technology</a></li>
					    <li role="presentation" class="divider"></li>
					    <li role="presentation" class="newscategory" value="All news"><a role="menuitem" tabindex="-1" href="#">All news</a></li>
					  </ul>
					  </div>
					</div>
  					<ul class="list-group" id="news-list" style="margin-top:10px;height: 500px;overflow-y: scroll;cursor: pointer;">
					</ul>
  				</div>
  				<div class="col-md-8" id="news-full">
  				</div>
			</div>
		</div>
		<div id="thehiddenformtag" style="display:none;">
  			<div class="input-group">
			  <input type="text" class="form-control" placeholder="tag this article #apple #APPL">
			  <span class="input-group-btn">
			    <button class="btn btn-default" type="button" class="tagsubmit">Go!</button>
			  </span>
			</div>
			<div class="alert alert-success" style="display:none; margin:20px;" id="alert" role="alert"></div>
		</div>
		<script>
			var newscategory="",filter="",newsdata, 
			newslistitem = $("<li/>").addClass("list-group-item").click(function(){
				$(".list-group-item").each(function(){
					$(this).removeClass("active");
				});
				$(this).addClass("active");
				$.get("./php_scripts/ajax/query/single_news.php?newsid="+$(this).attr("newsid"),function(data,status){
					newsdata = jQuery.parseJSON(data);
					$("#news-full").empty();
					var header = megatitleitem.clone(true).text(htmlDecode(newsdata.title)+" ");
				    smalldate.clone(true).text(mysqlStupidDateFormat(newsdata.date)).appendTo(header);
				    header.appendTo($("#news-full"));
					$("<p/>").text(htmlDecode(unescape(newsdata.content))).appendTo($("#news-full"));

					var tagform = $("#thehiddenformtag").clone(true).show();
					tagform.children().find("input").val(newsdata.tags);
					tagform.find("button").attr("newsid",newsdata.id);
					tagform.find("button").click(function(){
						var tag = $(this).parent().parent().find("input");
						$.get("./php_scripts/ajax/update/tag_adding.php?newsid="+$(this).attr("newsid")+"&tag="+escape(tag.val()),function(data,status){
							$("#alert").text(data);
							$("#alert").show();
						});
					});
					tagform.appendTo($("#news-full"));
				});
			}), 
			megatitleitem=$("<h1/>"),
			titleitem=$("<h4/>").addClass("list-group-item-heading"), 
			descriptionitem = $("<p/>").addClass("list-group-item-text"), 
			smalldate=$("<small/>");

			function updateNewsList(){
				$("#news-list").empty();
				if(newsdata!=null){
					for(var i=0;i<newsdata.length;i++){
				        var news = newsdata[i];
				        var newsitemcontainer = newslistitem.clone(true);
				        var newsheader = titleitem.clone(true).text(htmlDecode(news.title)+" ");
				        smalldate.clone(true).text(mysqlStupidDateFormat(news.date)).appendTo(newsheader);
				        newsheader.appendTo(newsitemcontainer);
				        descriptionitem.clone(true).text(htmlDecode(news.description)).appendTo(newsitemcontainer);
				        newsitemcontainer.attr("newsid",news.id);
				        newsitemcontainer.appendTo($("#news-list"));
				    }
				}
			}
			$("#newssearch").change(function(){
				if($("#newssearch").val()!=""){
					filter = "filter="+$("#newssearch").val();
				}else{
					filter ="";
				}
				updateNews();
			});
			$(".newscategory").click(function(){
				$("#newscategory").text($(this).attr("value"));
				if($(this).attr("value")!=""){
					newscategory = "newscategory="+$(this).attr("value");
				}else{
					newscategory ="";
				}
				if($(this).attr("value")=="All news"){
					newscategory="";
				}
				updateNews();
			});
			function htmlDecode(value){
			  return $('<div/>').html(value).text();
			}
			function htmlEncode(value){
			  return $('<div/>').text(value).html();
			}
			var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
			function mysqlStupidDateFormat(yyddmm){
				var parts = yyddmm.split("-");
				return parts[2] + " " + months[parts[1]-1] + " "+ parts[0];
			}
			$(function() {
				updateNews();
			});
			function updateNews(){
				var url = "./php_scripts/ajax/query/all_news.php?";
				if(newscategory=="" && filter==""){
					url = "./php_scripts/ajax/query/all_news.php";
				}
				if(newscategory!="" && filter!=""){
					filter = "&"+filter;
				}
				$.get(url+newscategory+filter,function(data,status){
					newsdata = jQuery.parseJSON(data);
					updateNewsList();
				});
			}
		</script>
	</body>
</html>