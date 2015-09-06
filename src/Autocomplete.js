var path =			require('path');
var Bluebird =		require('bluebird');
var fs =			require('fs');
Bluebird.promisifyAll(fs);
var hifo =			require('hifo');

var tokenize =		require('vbb-util').locations.stations.tokenize;





var base = path.join(__dirname, '..', 'data');

module.exports = {



	stations:	null,   // An object of stations with the keys being stringified ids. See `data/stations.json`.
	tokens:		null,   // For each `token`, there is an `Array` of station ids. See `data/tokens.json`.
	ready:		null,   // Resolves once `stations` and `keys` are ready.

	// The last query. Looks like this:
	// [ {
	//     word: 'sbahn',
	//     tokens: [
	//         {t: 'sbahn', r: 1 }
	//     ]
	// }, {
	//     word: 'weste'
	//     tokens: [
	//         {t: 'westend', r: 5/7 },
	//         {t: 'westewitz', r: 5/9 },
	//         {t: 'westendallee', r: 5/12 }
	//     ]
	// } ]
	_last:		null,
	_results:	null,   // A `hifo` instance that stores the highest values passed in.



	init: function (limit) {
		// load JSON files
		var ready = Bluebird.defer();
		this.ready = ready.promise.bind(this);

		fs.readFileAsync(path.join(base, 'stations.json'))
		.bind(this).then(function (stations) {
			this.stations = JSON.parse(stations);
			if (this.tokens) ready.resolve(true);
		});

		fs.readFileAsync(path.join(base, 'tokens.json'))
		.bind(this).then(function (tokens) {
			this.tokens = JSON.parse(tokens);
			if (this.stations) ready.resolve(true);
		});

		this._last = [];
		this._results = hifo(this._sortStations, limit || 6);

		return this;
	},

	_sortStations: hifo.highest('relevance', 'weight'),



	suggest: function (query) {
		return this.ready.then(function () {
			var words, i;

			words = tokenize(query).split(' ');
			query = [];

			for (i in words) {
				if (this._last[i] && this._last[i].word === words[i])
					query.push(this._last[i]);
				else query.push({
					word:	words[i],
					tokens: this._tokensByWord(words[i])
				});
			}

			// subtract match for old `word`s
			for (i in this._last) {
				if (query[i] === this._last[i]) continue;
				this._removeRelevanceByTokens(this._last[i].tokens);
			}

			// add match for new `word`s
			for (i in query) {
				if (query[i] === this._last[i]) continue;
				this._addRelevanceByTokens(query[i].tokens);
			}

			this._last = query;
			return this._results.data;
		});
	},



	_tokensByWord: function (word) {
		var _results, wLength, token;
		_results = hifo(this._sortTokens, 3);

		if (this.tokens[word])   // look for an exact match
			return [{
				token:	word,
				relevance:	2
			}];

   		// look for matches beginning with `word`
		wLength = word.length;
		for (token in this.tokens) {
			if (token.length > wLength && word === token.slice(0, wLength))
				_results.add({
					token:	token,
					relevance:	wLength / token.length
				});
		}
		return _results.data;
	},

	_sortTokens: hifo.highest('relevance'),



	// todo: unite those two methods somehow
	_addRelevanceByTokens: function (tokens) {
		var i, token, j, id;
		for (i in tokens) {
			token = tokens[i].token;
			for (j in this.tokens[token]) {
				station = this.stations[this.tokens[token][j]];
				station.relevance += tokens[i].relevance;
				this._results.add(station);
			}
		}
	},

	_removeRelevanceByTokens: function (tokens) {
		var i, token, j, station;
		for (i in tokens) {
			token = tokens[i].token;
			for (j in this.tokens[token]) {
				station = this.stations[this.tokens[token][j]];
				station.relevance -= tokens[i].relevance;
				this._results.add(station);
			}
		}
	},



};
