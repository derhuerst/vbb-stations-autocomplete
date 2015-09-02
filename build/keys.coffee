path =			require 'path'
fs =			require 'fs'
sets =			require 'vbb-static'
util =			require 'vbb-util'





console.log 'Creating a search index from vbb-static.'
base = path.join __dirname, '..', 'data'

set = sets.stations('all')
set.on 'error', (err) ->
	console.error err.stack

keys = {}
set.on 'data', (data) ->
	splitted = util.locations.stations.tokenize(data.name).split ' '
	for key in splitted
		if not keys[key] then keys[key] = []
		keys[key].push data.id

set.on 'end', () ->
	fs.writeFile path.join(base, 'keys.json'), JSON.stringify(keys), (err) ->
		if err then console.error err.stack
		else console.log "Wrote to data/keys.json."
