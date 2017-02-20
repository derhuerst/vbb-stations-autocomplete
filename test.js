'use strict'

const mocked = require('sandboxed-module')
const sinon = require('sinon')
const test = require('tape')

const autocomplete = mocked.require('.', {requires: {
	'./stations.json': {
		one: {id: 'one', name: 'Foo Station', weight: 10, tokens: 2},
		two: {id: 'two', name: 'Bar Main Station', weight: 20, tokens: 3}
	},
	'./tokens.json': {
		foo: ['one'],
		bar: ['two'],
		main: ['two'],
		station: ['one', 'two']
	}
}})



test('findTokensForFragment finds an exact match', (t) => {
	t.plan(3)
	const results = autocomplete.findTokensForFragment('main')

	t.strictEqual(results.length, 1)
	t.strictEqual(results[0].name, 'main')
	t.strictEqual(results[0].relevance, 2)
})

test('findTokensForFragment finds an match be first letters', (t) => {
	t.plan(3)
	const results = autocomplete.findTokensForFragment('mai')

	t.strictEqual(results.length, 1)
	t.strictEqual(results[0].name, 'main')
	t.strictEqual(results[0].relevance, 3/4)
})

test('findStationsForToken', (t) => {
	t.plan(3)
	const results = autocomplete.findStationsForToken({name: 'station'})

	t.strictEqual(results.length, 2)
	t.ok(results.includes('one'))
	t.ok(results.includes('two'))
})



test('autocomplete returns an array', (t) => {
	t.plan(2)
	t.ok(Array.isArray(autocomplete('', 3)))
	t.ok(Array.isArray(autocomplete('foo', 3)))
})

test('autocomplete returns an empty array for an empty query', (t) => {
	t.plan(1)
	const results = autocomplete('', 3)

	t.strictEqual(results.length, 0)
})

test('autocomplete sorts by relevance', (t) => {
	t.plan(2)
	const results = autocomplete('statio', 3)

	t.strictEqual(results.length, 2)
	t.ok(results[0].relevance >= results[1].relevance)
})

test('autocomplete calculates the relevance correctly', (t) => {
	t.plan(5)
	const results = autocomplete('statio', 3)

	t.strictEqual(results.length, 2)
	t.strictEqual(results[0].id, 'one')
	t.strictEqual(results[0].relevance, 6/7 * Math.sqrt(10))
	t.strictEqual(results[1].id, 'two')
	t.strictEqual(results[1].relevance, 6/7 * Math.sqrt(20) * 2 / 3)
})

test('autocomplete limits the number of results', (t) => {
	t.plan(1)
	t.strictEqual(autocomplete('statio', 1).length, 1)
})
