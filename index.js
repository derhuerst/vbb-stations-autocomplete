'use strict'

const hifo =         require('hifo')
const tokenize =     require('vbb-util').locations.stations.tokenize

const allStations =  require('./data/stations.json')
const allTokens =    require('./data/tokens.json')

// naming:
// - a fragment is a part of a search query
// - a token is a part of a stations' name
// - a result is a triple of station, relevance & weight





const findTokensForFragment = function (fragment) {
	let results = []
	for (let token in allTokens) {

		if (token === fragment) { // exact match
			results.push({
				name:      fragment,
				relevance: Math.sqrt(fragment.length)
			})
			break
		}

		// match beginning with `fragment`
		if (fragment === token.slice(0, fragment.length))
			results.push({
				name:      token,
				relevance: fragment.length / token.length
			})
	}
	return results
}

const findStationsForToken = (token) => allTokens[token.name]



const enrichTokenWithStations = (token) => Object.assign(
	token,
	{stations: findStationsForToken(token)}
)

const enrichFragmentWithTokens = (fragment) => ({
	name:   fragment,
	tokens: findTokensForFragment(fragment)
		.map(enrichTokenWithStations)
})



const stationsOfToken = (acc, token) => acc.concat(token.stations)
const stationsOfFragment = (fragment) => fragment.tokens
	.reduce(stationsOfToken, [])

const stationMatchesAllFragments = (stationsOfFragments) =>
	(station) => stationsOfFragments
		.every((stationsOfFragment) => stationsOfFragment.indexOf(station) >= 0)

const filterStationsOfFragmentsByAnd = function (fragments) {
	let p = stationMatchesAllFragments(fragments.map(stationsOfFragment))

	for (let fragment of fragments) {
		fragment.tokens = fragment.tokens
			.filter(function (token) {
				token.stations = token.stations.filter(p)
				return token.stations.length > 0
			})
	}
}



const autocomplete = function (query, limit) {
	if (query === '') return []
	let results = hifo(hifo.highest('relevance'), limit || 6)

	let fragments = tokenize(query).split(' ')
		.map(enrichFragmentWithTokens)
	filterStationsOfFragmentsByAnd(fragments)

	let stations = {}
	for (let fragment of fragments) {
		for (let token of fragment.tokens) {
			for (let id of token.stations) {
				let station = allStations[id]

				if (!stations[id]) {
					stations[id] = Object.create(station)
					stations[id].relevance = 1
				}

				stations[id].relevance *= token.relevance
			}
		}
	}

	for (let id in stations) {
		let station = stations[id]
		station.relevance *= Math.sqrt(station.weight)
		station.relevance *= 1 / station.tokens
		results.add(station)
	}

	return results.data
}



module.exports = Object.assign(autocomplete, {
 	findTokensForFragment, findStationsForToken,
 	enrichTokenWithStations, enrichFragmentWithTokens,
 	stationsOfToken, stationsOfFragment,
 	stationMatchesAllFragments, filterStationsOfFragmentsByAnd
})
