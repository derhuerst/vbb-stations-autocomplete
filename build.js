'use strict'

const fs = require('fs')
const path = require('path')
const {tokenize} = require('.')
const stations = require('vbb-stations')
const aliases = require('vbb-common-places/stations')
const buildIndex = require('synchronous-autocomplete/build')

const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}

const writeJSON = (file, data, cb) => {
	fs.writeFile(path.join(__dirname, file), JSON.stringify(data), cb)
}

console.info('Collecting search items.')

const items = stations('all').map((station) => ({
	id: station.id,
	name: station.name,
	weight: station.weight
}))

for (const alias of Object.keys(aliases)) {
	const id = aliases[alias]

	const [station] = stations(id)
	if (!station) {
		console.error(`Alias "${alias}" for unknown station ${id}.`)
		continue
	}

	items.push({
		id: station.id,
		name: alias,
		weight: Math.ceil(station.weight / 2)
	})
}

console.info('Computing a search index.')

const {
	tokens, scores, weights, nrOfTokens, originalIds
} = buildIndex(tokenize, items)

console.info('Writing the index to disk.')

writeJSON('original-ids.json', originalIds, showError)
writeJSON('tokens.json', tokens, showError)
writeJSON('scores.json', scores, showError)
writeJSON('weights.json', weights, showError)
writeJSON('nr-of-tokens.json', nrOfTokens, showError)
