var Queue = require("./Queue");

var events = require("events");
var fs = require("fs");

var FileWritter = function(filename){
	events.EventEmitter.call(this);
	this.setMaxListeners(0);

	var _this = this;

	this.queue = new Queue();
	this.stream = fs.createWriteStream(filename);
	this.stream.on("drain", function(){
		_this.leaveWritting();
		_this.onWrite();
	});

	this.queue.on("put", function(){
		_this.onWrite();
	});

	this.writting = false;
	this.closed = false;
};

var o = new events.EventEmitter();

o.append = function(buf){
	this.queue.put(buf);
};

o.close = function(){
	var _this = this;
	this.closed = true;
};

o.enterWritting = function(){
	if (this.closed) {
		return false;
	}

	if (this.writting === true) {
		return false;
	}

	this.writting = true;
	return true;
};

o.leaveWritting = function(){
	this.writting = false;

	if (this.closed && this.queue.isEmpty()) {
		this.stream.end();
	}
};

o.onWrite = function(){
	if (!this.enterWritting()) {
		return ;
	}

	while(!this.queue.isEmpty()) {
		var buf = this.queue.get();
		var writeRet = this.stream.write(buf);
		if (!writeRet) {
			// wait for drain
			return ;
		}
	}

	this.leaveWritting();
};

FileWritter.prototype = o;

module.exports = FileWritter;