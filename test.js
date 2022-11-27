'use strict'

const test = require('tape')
const sortBy = require('lodash.sortby')

const autocomplete = require('.')

const uMehringdamm = 'de:11000:900017101'

test('autocomplete returns an array', (t) => {
	t.plan(2)
	t.ok(Array.isArray(autocomplete('', 3)))
	t.ok(Array.isArray(autocomplete('foo', 3)))
})

test('autocomplete returns an empty array for an empty query', (t) => {
	t.plan(1)
	const results = autocomplete('', 3)

	t.equal(results.length, 0)
})

test('autocomplete sorts by score', (t) => {
	t.plan(1)
	const results = autocomplete('statio', 3)

	t.deepEqual(results, sortBy(results, 'score').reverse())
})

test('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.equal(autocomplete('ubahn', 1).length, 1)
})

test('gives reasonable results', (t) => {
	const r0 = autocomplete('U Seestr.', 1)[0]
	t.ok(r0)
	t.equal((r0 || {}).id, 'de:11000:900009103')

	// todo: why is de:11000:900026105 not the first result 🤔
	// {
	// 	name: 'Berlin, Gatower Str./Heerstr.',
	// 	id: 'de:11000:900032106::2',
	// 	relevance: 17.58841093395118,
	// 	score: 241.51897980242367,
	// 	weight: 2589.25
	// } {
	// 	name: 'Berlin, Gatower Str./Heerstr.',
	// 	id: 'de:11000:900032106::3',
	// 	relevance: 17.58841093395118,
	// 	score: 213.72447331534786,
	// 	weight: 1794.25
	// } {
	// 	name: 'S Heerstr. (Berlin)',
	// 	id: 'de:11000:900026105',
	// 	relevance: 13.987155928412175,
	// 	score: 206.26667588626583,
	// 	weight: 3207
	// }
	const r1 = autocomplete('S Heerstr.', 3).find(({id}) => id === 'de:11000:900026105')
	t.ok(r1, 'failed to find de:11000:900026105 for "S Heerstr."')

	const r2 = autocomplete('kotti', 1, true)[0]
	t.ok(r2)
	t.equal((r2 || {}).id, 'de:11000:900013102')

	const r3 = autocomplete('S+U Alexanderplatz', 1, true, false)[0]
	t.ok(r3)
	t.equal((r3 || {}).id, 'de:11000:900100003')

	t.end()
})

test('gives results with "mehringd"', (t) => {
	const r0 = autocomplete('mehringd')
	t.ok(r0.some(r => r.id === uMehringdamm), `results include ${uMehringdamm} (U Mehringdamm)`)

	t.end()
})

test('does not give duplicates', (t) => {
	const res = autocomplete('alex', 10, false, true)
	const alex = res.filter(r => r.id === '900000100003')
	t.notOk(alex.length > 0)
	t.end()
})
