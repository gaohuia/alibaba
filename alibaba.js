var Promise = require("promise");
var http = require("http");
var URL = require("url");

function LoadUrl(url){
	if (typeof LoadUrl.cache[url] !== "undefined") {
		return LoadUrl.cache[url];
	}

	var urlInfo = URL.parse(url);
	return LoadUrl.cache[url] = new Promise(function(resolve, reject){
		http.request({
			host: urlInfo.host,
			path: urlInfo.path,
			headers: {
				"User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.5 Safari/536.11"
			}
		}, 
		function(res){
			res.setEncoding("utf-8");

			var htmlArr = [];
			res.on("data", function(chunk){
				htmlArr.push(chunk);	
			}).on("end", function(){
				resolve(htmlArr.join(''));
			}).on("error", function(){
				reject();
			});
		}).end();
	});
};
LoadUrl.cache = {};

function pickBetween(content, start, end, include)
{
	include = include || false;
	var pStart = content.indexOf(start);
	var pEnd = content.indexOf(end, pStart + start.length);
	if (include) {
		pEnd += end.length;
	} else {
		pStart += start.length;
	}

	return content.substring(pStart, pEnd);
}

function Alibaba()
{
	this.getImageArray = function(url){
		return new Promise(function(resolve, reject){
			LoadUrl(url).then(function(html){
				var p = html.indexOf("desc-lazyload-container");

				var temp1 = html.substr(p);
				temp1 = temp1.substr(temp1.indexOf("data-tfs-url"));
				temp1 = temp1.substr(0, temp1.indexOf("</div>"));
				
				var arr = temp1.match(/data-tfs-url="(.*?)"/);
				if (arr) {
					var contentUrl = arr[1];	
					LoadUrl(contentUrl).then(function(contentHtml){
						var pattern = /src="(.*?)"/g;
						var arr = null;
						var result = [];
						while((arr = pattern.exec(contentHtml)) != null) {
							result.push(arr[1]);
						}
						resolve(result);
					}, reject);
				} else {
					reject();
				}
			}, reject);			
		});
	};

	this.getBigImageArray = function(url){
		return new Promise(function(resolve, reject){
			LoadUrl(url).then(function(html){
				//console.log(html);
				var content = pickBetween(html, '<ul class="nav nav-tabs fd-clr">', '</ul>', true);
				//console.log(content);

				var pattern = /src="(.*?)"/g;
				var arr = null;
				var result = [];
				while((arr = pattern.exec(content)) != null) {
					result.push(arr[1].replace("64x64.jpg", "300x300.jpg"));
				}

				resolve(result);
			}, reject);
		});
	};
}

module.exports = new Alibaba();