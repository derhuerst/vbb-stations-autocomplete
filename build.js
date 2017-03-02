'use strict'

const stations = require('vbb-stations')
const aliases   = require('vbb-common-places').stations
const tokenize = require('vbb-tokenize-station')
const fs       = require('fs')
const path = require('path')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}



console.info('Joining vbb-stations & vbb-common-places.')

const data = stations('all')
.map((s) => Object.assign({tokens: tokenize(s.name)}, s))


console.info('Building a search index.')

const allStations = data.reduce((all, s) => {
	all[s.id] = {
		type: 'station',
		id: s.id,
		name: s.name,
		weight: s.weight,
		tokens: s.tokens.length,
		relevance: 0,
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

for (let alias in aliases) {
	const id = aliases[alias]
	const station = allStations[id]
	if (!station) console.error('Unknown station', id)

	for (let token of tokenize(alias)) {
		if (!(token in allTokens)) allTokens[token] = []
		allTokens[token].push(id)
	}
}



console.info('Writing index to file.')

fs.writeFile(path.join(__dirname, 'stations.json'), JSON.stringify(allStations), showError)
fs.writeFile(path.join(__dirname, 'tokens.json'), JSON.stringify(allTokens), showError)
