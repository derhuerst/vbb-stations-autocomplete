'use strict'

const allStations = require('vbb-stations/simple')
const prompt = require('cli-autocomplete')

const autocomplete = require('.')

const stationsById = Object.create(null)
for (let station of allStations) stationsById[station.id] = station

const suggest = (input) => {
	const results = autocomplete(input, 5)
	const choices = []

	for (let result of results) {
		const station = stationsById[result.id]
		if (!station) continue

		choices.push({
			title: [
				station.name,
				'score:', result.score.toFixed(3),
				'relevance:', result.relevance.toFixed(3)
			].join(' '),
			value: station.id
		})
	}

	return Promise.resolve(choices)
}

prompt('Type a station name!', suggest)
.once('abort', () => {
	process.exitCode = 1
})
.once('submit', (id) => {
	console.log(id)
})
