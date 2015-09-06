path =			require 'path'
fs =			require 'fs'
sets =			require 'vbb-static'
util =			require 'vbb-util'





console.log 'Creating a customized station list from vbb-static.'
base = path.join __dirname, '..', 'data'

set = sets.stations('all')
set.on 'error', (err) ->
	console.error err.stack

stations = {}
set.on 'data', (data) ->
	stations['' + data.id] =
		id:			data.id
		name:		data.name
		weight:		data.weight
		relevance:	0

set.on 'end', () ->
	fs.writeFile path.join(base, 'stations.json'), JSON.stringify(stations), (err) ->
		if err then console.error err.stack
		else console.log "Wrote to data/stations.json."
