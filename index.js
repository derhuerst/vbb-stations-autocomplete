'use strict'

const tokenize = require('./lib/tokenize')
const create = require('synchronous-autocomplete')

const tokens = require('./tokens.json')
const scores = require('./scores.json')
const weights = require('./weights.json')
const nrOfTokens = require('./nr-of-tokens.json')
const originalIds = require('./original-ids.json')

const autocomplete = create(tokens, scores, weights, nrOfTokens, originalIds, tokenize)

autocomplete.tokenize = tokenize
module.exports = autocomplete
