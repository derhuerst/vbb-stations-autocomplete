'use strict'

const mocked = require('sandboxed-module')
const test = require('tape')
const sortBy = require('lodash.sortby')

const autocomplete = mocked.require('.', {requires: {
	'./stations.json': {
		one: {
			type: 'station',
			id: 'one',
			name: 'Foo Station',
			weight: 10,
			tokens: 2
		},
		two: {
			type: 'station',
			id: 'two',
			name: 'Bar Main Station',
			weight: 20,
			tokens: 3
		}
	},
	'./tokens.json': {
		foo: ['one'],
		bar: ['two'],
		main: ['two'],
		station: ['one', 'two']
	}
}})



test('tokensByFragment finds an exact match', (t) => {
	t.plan(1)
	const results = autocomplete.tokensByFragment('main', false, false)

	t.deepEqual(results, {
		two: 1 + 2
	})
})

test('tokensByFragment finds a match by first letters', (t) => {
	t.plan(2)

	t.deepEqual(autocomplete.tokensByFragment('mai', true, false), {
		two: 1 + 3/4
	})

	t.deepEqual(autocomplete.tokensByFragment('mai', false, false), {})
})

test('tokensByFragment finds a match despite typos', (t) => {
	t.plan(1)
	const results = autocomplete.tokensByFragment('statoi', false, true)

	t.deepEqual(results, {
		one: 1 + 5/7,
		two: 1 + 5/7
	})
})



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

test('autocomplete calculates the relevance & score correctly', (t) => {
	t.plan(7)
	const results = autocomplete('statio', 3)

	t.equal(results.length, 2)
	t.equal(results[0].id, 'one')
	t.equal(results[0].relevance, (1 + 6/7) / 2) // 6 of 7 letters matched, 2 tokens
	t.equal(results[0].score, (1 + 6/7) / 2 * Math.sqrt(10))
	t.equal(results[1].id, 'two')
	t.equal(results[1].relevance, (1 + 6/7) / 3) // 6 of 7 letters matched, 3 tokens
	t.equal(results[1].score, (1 + 6/7) / 3 * Math.sqrt(20))
})

test('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.equal(autocomplete('statio', 1).length, 1)
})
