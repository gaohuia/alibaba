var Promise = require("promise");
var http = require("http");
var URL = require("url");

var FileWritter = require("./FileWritter");

var Downloader = function(url, filename){
	this.url = url;
	this.filename = filename;
};

Downloader.prototype.start = function(){
	var _this = this;
	var urlInfo = URL.parse(this.url);

	return new Promise(function(resolve, reject){
		var file = new FileWritter(_this.filename);

		http.request({
			"host" : urlInfo.host,
			"path" : urlInfo.path
		}, function(res){
			res.on("data", function(chunk){
				//console.log(chunk);
				file.append(chunk);
			}).on("end", function(){
				file.close();
			}).on("error", function(){
				console.log("error");
				file.close();
			});
		}).end();

		file.on("close", function(){
			resolve();
		});
	});
};

module.exports = Downloader;