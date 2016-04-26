'use strict'

const stations = require('vbb-stations')
const tokenize = require('vbb-tokenize-station')
const map      = require('through2-map')
const fs       = require('fs')
const through  = require('through2')
const common   = require('vbb-common-places')



const showError = (err) => {
	if (!err) return
	console.error(err.stack)
	process.exit(1)
}



console.info('Creating a search index from vbb-stations.')

const allStations = {}
const allTokens   = {}

const onStation = (station) => {
	allStations[station.id] = {
		  id:        station.id
		, name:      station.name
		, weight:    station.weight
		, tokens:    station.tokens.length
		, relevance: 0
	}

	for (let token of station.tokens) {
		if (!(token in allTokens)) allTokens[token] = []
		allTokens[token].push(station.id)
	}
}



stations('all').on('error', showError)
.pipe(map.obj((station) => {
	station.tokens = tokenize(station.name)
	return station
}))
.on('data', onStation)
.on('end', () => {
	console.info('Done.')

	console.info('Adding stations from vbb-common-places.')
	const digest = through.obj(function (alias, _, cb) {
		const self = this
		stations(alias.id).on('error', cb)
		.on('data', (station) => {
			station.tokens = tokenize(alias.name)
			this.push(station)
		})
		.on('end', () => cb())
	})

	.on('data', onStation)
	.on('end', () => {
		console.info('Done.')

		fs.writeFile('./stations.json', JSON.stringify(allStations), showError)
		fs.writeFile('./tokens.json', JSON.stringify(allTokens), showError)
	})

	for (let name in common) {digest.write({name, id: common[name]})}
	digest.end()

})
