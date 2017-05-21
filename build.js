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
		n: s.name,
		w: s.weight,
		t: tokens.length
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



console.info('Computing token scores.')

const scores = {}

const nrOfAllStations = Object.keys(allStations).length
for (let token in allTokens) {
	const nrOfStations = allTokens[token].length
	scores[token] = nrOfStations / nrOfAllStations
}

let max = 0
for (let token in scores) {
	max = Math.max(scores[token], max)
}

for (let token in scores) {
	let score = (max - scores[token]) / max // revert, clamp to [0, 1]
	score = Math.pow(score, 3) // stretch distribution
	scores[token] = parseFloat(score.toFixed(5))
}



console.info('Writing index to file.')

writeJSON('stations.json', allStations, showError)
writeJSON('tokens.json', allTokens, showError)
writeJSON('scores.json', scores, showError)
