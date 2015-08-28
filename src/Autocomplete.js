var path =			require('path');
var Index =			require('search-index');
var util =			require('vbb-util');
var Q =				require('q');





module.exports = {



	index:		null,

	init: function () {
		this.index = Index({
			deletable:		false,
			indexPath:		path.join(__dirname, '../data.leveldb')
		});

		return this;
	},



	suggest: function (query, limit) {
		var deferred = Q.defer();

		// todo: is there a difference between "phrase search" and "multi-word search"?
		// see https://github.com/fergiemcdowall/search-index/blob/master/doc/search.md
		query = util.locations.stations.tokenize(query).split(' ');
		results = [];

		this.index.search({
			query: {
				keys: query
			},
			pageSize: limit || 8
		}, function (err, result) {
			if (err) return deferred.reject(err);
			for (var i = 0; i < result.hits.length; i++) {
				results.push(result.hits[i].document);
			}
			deferred.resolve(results);
		});
		// todo: sort results?
		// see https://github.com/fergiemcdowall/search-index/blob/master/doc/search.md

		return deferred.promise;
	}



};
