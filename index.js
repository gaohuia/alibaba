var Downloader = require("./Downloader");
var alibaba = require("./alibaba");

process.argv.slice(2).forEach(function(val, index, array) {
	var conentPromise = alibaba.getImageArray(val);
	conentPromise.then(function(imgArr){
		var i;
		for(i in imgArr) {
			var src = imgArr[i];
			
			var tool = new Downloader(src, "result/" + i + ".jpg");
			tool.start();
		}
	});

	alibaba.getBigImageArray(val).then(function(imgArr){
		var i;
		for(i in imgArr) {
			var src = imgArr[i];
			
			var tool = new Downloader(src, "big/" + i + ".jpg");
			tool.start();
		}
	});
});

