var events = require("events");

var Queue = function(){
	events.EventEmitter.call(this);
	this.setMaxListeners(0);
	this.queue = [];
};

Queue.prototype = new events.EventEmitter();

Queue.prototype.put = function(buf){
	this.queue.push(buf);
	this.emit('put', buf);
};

Queue.prototype.get = function(){
	var buf = this.queue.shift();
	if (this.queue.length === 0) {
		this.emit('empty');
	}
	return buf;
};

Queue.prototype.isEmpty = function(){
	return 0 === this.queue.length;	
};

module.exports = Queue;