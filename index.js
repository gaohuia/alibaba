var Downloader = require("./Downloader");
var alibaba = require("./alibaba");

function getFormatNumber(i)
{
	var str = '' + i;
	var arr = new Array(2-str.length);
	arr.push(str);
	return arr.join('0');
}

process.argv.slice(2).forEach(function(val, index, array) {
	var conentPromise = alibaba.getImageArray(val);
	conentPromise.then(function(imgArr){
		var i;
		for(i in imgArr) {
			var src = imgArr[i];
			
			var tool = new Downloader(src, "result/" + getFormatNumber(i) + ".jpg");
			tool.start();
		}
	});

	alibaba.getBigImageArray(val).then(function(imgArr){
		var i;
		for(i in imgArr) {
			var src = imgArr[i];
			
			var tool = new Downloader(src, "big/" + getFormatNumber(i) + ".jpg");
			tool.start();
		}
	});
});

