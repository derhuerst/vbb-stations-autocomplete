Q =				require 'q'
path =			require 'path'
Index =			require 'search-index'
sets =			require 'vbb-static'
util =			require 'vbb-util'





db = Index
	deletable:		false
	indexPath:		path.join __dirname, '../data.leveldb'
	nGramLength:	1



console.log 'Creating a search index from vbb-static.'

set = sets.allStations()
set.on 'error', (err) ->
	console.error err.stack

batch = []
set.on 'data', (data) ->
	batch.push
		id:		data.id
		keys:	util.locations.stations.tokenize data.name
	if batch.length >= 1000
		db.add {}, batch, (err) ->
			if (err) then console.error err.stack
		batch = []
