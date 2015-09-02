// todo: move to npm module && unit tests

var PriorityQueue = module.exports = function (key, size) {
	this._k = key || 'value'
	this._s = size || 50
	this.data = [];
};



PriorityQueue.prototype.add = function (entry) {
	var key = this._k, i = this.data.length;
	if (i === 0) this.data.push(entry);
	else {
		i--;   // now the last entry
		if (this.data.length >= this._s && entry[key] < this.data[i][key]) return this;

		while (i >= 0 && entry[key] >= this.data[i][key]) i--;
		this.data.splice(i + 1, 0, entry);
		if (this.data.length > this._s) this.data.pop();

	}
	return this;
};



PriorityQueue.prototype.reset = function () {
	this.data = [];
	return this;
};
