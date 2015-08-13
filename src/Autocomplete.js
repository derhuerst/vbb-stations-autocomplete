var path =			require('path');
var Index =			require('fuse.js');

var index =			require('../data/index.json');
var stations =		require('vbb-static/stations');
var util =			require('vbb-util');





module.exports = {



	index:		null,

	init: function () {
		this.index = new Index(index, {
			keys:			[ 'keys' ],
			shouldSort:		true,
			threshold:		0.2,
			sortFn: function (a, b) {
				return b.item.weight - a.item.weight;
			}
		});

		return this;
	},



	suggest: function (query, limit) {
		return this.index.search(this._clean(query)).slice(0, limit || 6);
	},



	// clean search results
	_clean: util.locations.stations.tokenize



};
