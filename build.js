'use strict'

const fs = require('fs')
const path = require('path')
const tokenize = require('vbb-tokenize-station')
const stations = require('vbb-stations')
const aliases = require('vbb-common-places').stations
const buildIndex = require('synchronous-autocomplete/build')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}

const idGenerator = () => {
	let i = 1
	return () => (i++).toString(36)
}



console.info('building a search index')

// we map the IDs to get smaller file sizes
const originalIds = Object.create(null)
const generateNewId = idGenerator()

const items = []

let currentId = 0
for (let station of stations('all')) {
	const newId = generateNewId()
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

	const newId = generateNewId()
	originalIds[newId] = originalId

	items.push({
		id: newId,
		name: alias,
		weight: Math.ceil(station.weight / 2)
	})
}

const {tokens, scores, weights, nrOfTokens} = buildIndex(tokenize, items)



console.info('Writing the index to disk.')

writeJSON('tokens.json', tokens, showError)
writeJSON('scores.json', scores, showError)
writeJSON('weights.json', weights, showError)
writeJSON('nr-of-tokens.json', nrOfTokens, showError)
