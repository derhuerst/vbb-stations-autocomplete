'use strict'

const stations = require('vbb-stations')
const tokenize = require('vbb-tokenize-station')
const fs       = require('fs')



const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}



console.info('Creating a search index from vbb-stations.')

const allStations = {}
const allTokens   = {}

stations('all').on('error', showError)
.on('data', (station) => {
	let tokens = tokenize(station.name)
	allStations[station.id] = {
		  id:        station.id
		, name:      station.name
		, weight:    station.weight
		, tokens:    tokens.length
		, relevance: 0
	}

	for (let token of tokens) {
		if (!(token in allTokens)) allTokens[token] = []
		allTokens[token].push(station.id)
	}
})

.on('end', () => {
	fs.writeFile('./stations.json', JSON.stringify(allStations), showError)
	fs.writeFile('./tokens.json', JSON.stringify(allTokens), showError)
})
