var path =			require('path');
var Bluebird =		require('bluebird');
var fs =			require('fs');
Bluebird.promisifyAll(fs);

var PriorityQueue =	require('./PriorityQueue');
var util =			require('vbb-util');





module.exports = {



	stations:	null,   // the list of stations
	keys:		null,   // a lookup table
	ready:		null,   // resolves once `stations` and `keys` are ready

	// A `Search` instance stores the previous search for better performance. So if one of the tokens changes because the user continues typing it, the results for the other tokens don't have to be recomputed.
	_tokens:	null,   // the weighting for each token that we added to the results, grouped by query part
	_ids:		null,   // the sum of weightings for each result
	_results:	null,   // a limited priority queue of results



	init: function () {
		var base, ready;

		// load JSON files
		var base = path.join(__dirname, '..', 'data');
		var ready = Bluebird.defer();
		this.ready = ready.promise.bind(this);

		fs.readFileAsync(path.join(base, 'stations.json'))
		.bind(this)
		.then(function (stations) {
			this.stations = JSON.parse(stations);
			if (this.keys) ready.resolve(true);
		});
		fs.readFileAsync(path.join(base, 'keys.json'))
		.bind(this)
		.then(function (keys) {
			this.keys = JSON.parse(keys);
			if (this.stations) ready.resolve(true);
		});

		this._tokens = {};
		this._ids = {};

		return this;
	},



	suggest: function (query, limit) {
		return this.ready.then(function () {
			var i, j, parts, part, tokens, token, matches;

			parts = util.locations.stations.tokenize(query).split(' ');

			// remove old tokens
			for (part in this._tokens) {
				if (parts.indexOf(part) < 0) {
					tokens = this._tokens[part];
					for (token in tokens) {
						weighting = tokens[token];
						this._weight(this.keys[token], -weighting);
						delete tokens[token];
					}
				}
			}

			// apply new tokens
			for (i in parts) {
				part = parts[i];
				if (!this._tokens[part]) {
					tokens = this._tokens[part] = {};
					matches = this._match(part);
					for (j in matches) {
						token = matches[j].t;
						weighting = matches[j].w;
						this._weight(this.keys[token], weighting);
						tokens[token] = weighting;
					}
				}
			}

			var id, relevance;

			// accumulate results
			this._results = new PriorityQueue('relevance', limit || 8);
			for (id in this._ids) {
				relevance = this._ids[id] * 3;
				if (relevance === 0) continue;
				id = parseInt(id);
				relevance += parts.length / this.stations[id].k
				this._results.add({
					id:			id,
					name:		this.stations[id].n,
					relevance:	relevance
				});
			}
			return this._results.data;
		});
	},



	_match: function (part, limit) {
		limit = limit || 3;
		var results = [];
		var count = 0;

		// look for an exact match
		if (this.keys[part]) {
			results.push({
				t:	part,   // token
				w:	2    // weighting
			});
			count++;
		}

		var pLength, token, tLength;

		// look for matches beginning with `part`
		pLength = part.length;
		for (token in this.keys) {
			if (count >= limit) break;
			tLength = token.length;
			if (tLength > pLength && part === token.slice(0, pLength)) {
				results.push({
					t:	token,   // token
					w:	pLength / tLength   // weighting
				});
				count++;
			}
		}

		return results.sort(function (a, b) {
			return b.d - a.d;
		});
	},



	_weight: function (ids, delta) {
		for (i in ids) {
			id = ids[i] + '';
			if (this._ids[id]) this._ids[id] += delta;
			else this._ids[id] = delta;
		}
	}



};
