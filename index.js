'use strict'

const hifo = require('hifo')
const tokenize = require('vbb-tokenize-station')
const maxBy = require('lodash.maxby')
const leven = require('leven')

const stations = require('./stations.json')
const tokens = require('./tokens.json')



const tokensByFragment = (fragment, completion, fuzzy) => {
	const results = {}
	const l = fragment.length

	for (let token in tokens) {
		let relevance
		let distance

		// add-one smoothing
		if (fragment === token) relevance = 1 + Math.sqrt(fragment.length)
		else if (completion && fragment === token.slice(0, l)) {
			relevance = 1 + fragment.length / token.length
		} else if (fuzzy && (distance = leven(fragment, token)) <= 3) {
			relevance = 1 + (token.length - distance) / token.length
		} else continue

		for (let id of tokens[token]) {
			if (!results[id] || !results[id] < relevance) {
				results[id] = relevance
			}
		}
	}

	return results
}

const autocomplete = (query, limit = 6, fuzzy = false, completion = true) => {
	if (query === '') return []
	const relevant = hifo(hifo.highest('score'), limit || 6)

	const data = {}
	for (let fragment of tokenize(query)) {
		data[fragment] = tokensByFragment(fragment, completion, fuzzy)
	}

	const totalRelevance = (id) => {
		let r = 1 / stations[id].tokens
		for (let fragment in data) {
			if (!data[fragment][id]) return false
			r *= data[fragment][id]
		}
		return r
	}

	const results = {}
	for (let fragment in data) {
		for (let id in data[fragment]) {
			const relevance = totalRelevance(id)
			if (relevance === false) continue

			const station = stations[id]
			const score = relevance * Math.sqrt(station.weight)

			if (!results[id] || results[id].score < score) {
				results[id] = {id, relevance, score}
			}
		}
	}

	for (let id in results) relevant.add(results[id])
	return relevant.data.map((r) => Object.assign(r, stations[r.id]))
}

module.exports = Object.assign(autocomplete, {
	tokensByFragment
})
