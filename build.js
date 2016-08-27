'use strict'

const stations = require('vbb-stations')
const common   = require('vbb-common-places')
const tokenize = require('vbb-tokenize-station')
const fs       = require('fs')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}



console.info('Joining vbb-stations & vbb-common-places.')

const data = stations('all')
.map((s) => {s.tokens = tokenize(s.name); return s})

for (let name in common) {
	const station = stations(common[name])
	data.push(Object.assign({}, station, {
		tokens: tokenize(name)
	}))
}


console.info('Building a search index.')

const allStations = data.reduce((all, station) => {
	all[station.id] = {
		  id:        station.id
		, name:      station.name
		, weight:    station.weight
		, tokens:    station.tokens.length
		, relevance: 0
	}
	return all
}, {})

const allTokens = data.reduce((all, station) => {
	for (let token of station.tokens) {
		if (!(token in all)) all[token] = []
		all[token].push(station.id)
	}
	return all
}, {})



console.info('Writing index to file.')

fs.writeFile('./stations.json', JSON.stringify(allStations), showError)
fs.writeFile('./tokens.json', JSON.stringify(allTokens), showError)
