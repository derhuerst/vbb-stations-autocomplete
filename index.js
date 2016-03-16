'use strict'

const hifo =      require('hifo')
const mergeWith = require('lodash.mergewith')

const tokenize =  require('vbb-util').locations.stations.tokenize

const stations =  require('./data/stations.json')
const tokens =    require('./data/tokens.json')

// naming:
// - a fragment is a part of a search query
// - a token is a part of a stations' name
// - a result is a triple of station, relevance & weight





const heatMap = function (things) {
	const result = {}
	for (let i in things) {
		if (things[i] in result) result[things[i]]++
		else result[things[i]] = 1
	}
	return result
}

const diffFragments = function (a, b) {
	let result = mergeWith(heatMap(a), heatMap(b), (vA, vB, k, a) => (k in a) ? vA - vB : -vB)

	for (let i in result) {
		if (result[i] === 0) delete result[i]
		else result[i] *= -1
	}

	return result
}



const sortTokens = hifo.highest(1)

const findTokensByFragment = function (tokens, fragment) {
	// look for an exact match
	if (tokens[fragment]) return [[fragment, Math.sqrt(fragment.length)]]

	let results = hifo(sortTokens, 3)

	// look for matches beginning with `fragment`
	for (let token in tokens) {
		if (fragment === token.slice(0, fragment.length))
			results.add([token, fragment.length / token.length])
	}

	return results.data
}



const autocomplete = function (limit) {

	// A `hifo` instance that stores the highest values passed in.
	let results = hifo(hifo.highest('relevance', 'weight'), limit || 6)
	let lastQuery = []

	let refs = []

	return function (query) {
		query = tokenize(query).split(' ')
		let diff = diffFragments(lastQuery, query)

		for (let fragment in diff) {
			let tokensForFragment = findTokensByFragment(tokens, fragment)
			console.log('tokensForFragment', fragment, tokensForFragment)
			for (let token of tokensForFragment) {
				let stationsForToken = tokens[token[0]]
				for (let station of stationsForToken) {

					if (!refs[station])
						refs[station] = Object.create(stations[station])

					refs[station].relevance += token[1] * diff[fragment] * 2 / stationsForToken.length
					results.add(refs[station])

					if (refs[station].relevance <= 0) delete refs[station]
				}
			}
		}

		lastQuery = query
		return results.data
	}




}

module.exports = Object.assign(autocomplete, {
	diffFragments,
	findTokensByFragment
})
