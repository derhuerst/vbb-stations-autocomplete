'use strict'

const fs = require('fs')
const path = require('path')
const tokenize = require('vbb-tokenize-station')
const stations = require('vbb-stations')
const aliases = require('vbb-common-places').stations

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}



console.info('Collecting search items.')

// we map the IDs to get smaller file sizes
const originalIds = []
let currentId = 0

const items = []

for (let station of stations('all')) {
	const newId = currentId++
	originalIds[newId] = station.id

	items.push({
		id: newId,
		name: station.name,
		weight: station.weight
	})
}

for (let alias in aliases) {
	const originalId = aliases[alias]
	const station = stations(originalId)[0]
	if (!station) {
		console.error(`Alias "${alias}" for unknown station ${originalId}.`)
		continue
	}

	const newId = currentId++
	originalIds[newId] = originalId

	items.push({
		id: newId,
		name: alias,
		weight: Math.ceil(station.weight / 2)
	})
}



console.info('Computing a search index.')

const tokens = Object.create(null)
const weights = []
const nrOfTokens = []

for (let item of items) {
	const tokensOfItem = tokenize(item.name)
	for (let token of tokensOfItem) {
		if (!Array.isArray(tokens[token])) tokens[token] = []
		if (!tokens[token].includes(item.id)) tokens[token].push(item.id)
	}

	weights[item.id] = item.weight
	nrOfTokens[item.id] = tokensOfItem.length
}

const scores = Object.create(null)
for (let token in tokens) {
	const nrOfItemsForToken = tokens[token].length
	scores[token] = nrOfItemsForToken / items.length
}



console.info('Writing the index to disk.')

writeJSON('original-ids.json', originalIds, showError)
writeJSON('tokens.json', tokens, showError)
writeJSON('scores.json', scores, showError)
writeJSON('weights.json', weights, showError)
writeJSON('nr-of-tokens.json', nrOfTokens, showError)
