path =			require 'path'
fs =			require 'fs'
sets =			require 'vbb-static'
util =			require 'vbb-util'





console.log 'Creating a search index from vbb-static.'
base = path.join __dirname, '..', 'data'

set = sets.stations('all')
set.on 'error', (err) ->
	console.error err.stack

tokens = {}
set.on 'data', (data) ->
	splitted = util.locations.stations.tokenize(data.name).split ' '
	for key in splitted
		if not tokens[key] then tokens[key] = []
		tokens[key].push data.id

set.on 'end', () ->
	fs.writeFile path.join(base, 'tokens.json'), JSON.stringify(tokens), (err) ->
		if err then console.error err.stack
		else console.log "Wrote to data/tokens.json."
