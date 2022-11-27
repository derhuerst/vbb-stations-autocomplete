'use strict'

const _normalize = require('normalize-vbb-station-name-for-search')
const _tokenize = require('vbb-tokenize-station')
const create = require('synchronous-autocomplete')

const tokens = require('./tokens.json')
const scores = require('./scores.json')
const weights = require('./weights.json')
const nrOfTokens = require('./nr-of-tokens.json')
const originalIds = require('./original-ids.json')

// todo: DRY with https://github.com/derhuerst/berlin-gtfs-rt-server/blob/40bd787161ae7ce017610543d062dbcb1886c96b/lib/normalize.js#L6-L19
const tokenize = (name) => {
	try {
		return _normalize(name, {sbahnUbahn: true}).split(/\s+/g)
	} catch (err) {
		if (!err.isParseError) throw err
		const fallback = _tokenize(name)
		console.warn('\n\nfailed to parse station name', err)
		console.warn('using vbb-tokenize-station as fallback:', fallback)
		return fallback
	}
}

const autocomplete = create(tokens, scores, weights, nrOfTokens, originalIds, tokenize)

autocomplete.tokenize = tokenize
module.exports = autocomplete
