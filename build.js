'use strict'

const stations = require('vbb-stations')
const aliases = require('vbb-common-places').stations
const tokenize = require('vbb-tokenize-station')
const fs = require('fs')
const path = require('path')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}



console.info('Building a search index.')

const allStations = stations('all').reduce((all, s) => {
	const tokens = tokenize(s.name)

	all[s.id] = {
		type: 'station',
		id: s.id,
		name: s.name,
		weight: s.weight,
		tokens: tokens.length
	}
	return all
}, {})

const allTokens = stations('all').reduce((all, s) => {
	const tokens = tokenize(s.name)

	for (let token of tokens) {
		if (!(token in all)) all[token] = []
		all[token].push(s.id)
	}
	return all
}, {})



console.info('Adding aliases from vbb-common-places.')

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

writeJSON('stations.json', allStations, showError)
writeJSON('tokens.json', allTokens, showError)
