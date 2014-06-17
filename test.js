var http = require("http");

http.request({ path: '/img/ibank/2014/318/294/1477492813_1434086380.jpg',
  host: 'i02.c.aliimg.com' }, function(res){
	console.log(res);
}).end();