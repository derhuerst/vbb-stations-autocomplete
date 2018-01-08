'use strict'

const test = require('tape')
const sortBy = require('lodash.sortby')

const autocomplete = require('.')

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
	t.equal((r0 || {}).id, '900000009103')

	const r1 = autocomplete('S Heerstr.', 1)[0]
	t.ok(r1)
	t.equal((r1 || {}).id, '900000026105')

	const r2 = autocomplete('kotti', 1, true)[0]
	t.ok(r2)
	t.equal((r2 || {}).id, '900000013102')

	const r3 = autocomplete('S+U Alexanderplatz', 1, true, false)[0]
	t.ok(r3)
	t.equal((r3 || {}).id, '900000100003')

	t.end()
})
