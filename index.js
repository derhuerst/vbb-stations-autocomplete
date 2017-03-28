'use strict'

const hifo = require('hifo')
const tokenize = require('vbb-tokenize-station')
const maxBy = require('lodash.maxby')

const stations = require('./stations.json')
const tokens = require('./tokens.json')



const tokensByFragment = (fragment) => {
	const results = {}
	const l = fragment.length

	for (let token in tokens) {
		let relevance

		// add-one smoothing
		if (fragment === token) relevance = 1 + Math.sqrt(fragment.length)
		else if (fragment === token.slice(0, l)) {
			relevance = 1 + fragment.length / token.length
		} else continue

		for (let id of tokens[token]) {
			if (!results[id] || !results[id].relevance < relevance) {
				// todo: is storing the token really necessary?
				results[id] = {token: token, relevance}
			}
		}
	}

	return results
}

const autocomplete = (query, limit = 6) => {
	if (query === '') return []
	const relevant = hifo(hifo.highest('relevance'), limit || 6)

	const data = {}
	for (let fragment of tokenize(query)) {
		data[fragment] = tokensByFragment(fragment)
	}

	const totalRelevance = (id) => {
		let r = 1
		for (let fragment in data) {
			if (!data[fragment][id]) return false
			r *= data[fragment][id].relevance
		}
		return r / stations[id].tokens
	}

	const results = {}
	for (let fragment in data) {
		for (let id in data[fragment]) {
			const r = totalRelevance(id)
			if (r === false) continue

			const station = stations[id]
			r = r / station.tokens * station.weight

			if (!results[id] || results[id].relevance < r) {
				results[id] = {id, relevance: r}
			}
		}
	}

	for (let id in results) relevant.add(results[id])
	return relevant.data.map((r) => Object.assign(r, stations[r.id]))
}

module.exports = Object.assign(autocomplete, {
	tokensByFragment
})
