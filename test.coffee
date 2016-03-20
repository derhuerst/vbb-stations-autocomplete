'use strict'

sinon =           require 'sinon'
nodeunit =        require 'nodeunit'

requireMock = sinon.stub()
mock = (k, v) -> requireMock.withArgs(k).returns v

mock 'hifo',      require 'hifo'
mock 'vbb-util',  require 'vbb-util'
mock './data/stations.json',
	one: {id: 'one', name: 'Foo Station',      weight: 10, tokens: 2}
	two: {id: 'two', name: 'Bar Main Station', weight: 20, tokens: 3}
mock './data/tokens.json',
	foo: ['one'], bar: ['two'], main: ['two'], station: ['one', 'two']

moduleMock = exports: {}
nodeunit.utils.sandbox './index.js',
	require: requireMock,
	module:  moduleMock
autocomplete = moduleMock.exports

module.exports =



	findTokensForFragment:

		'finds an exact match': (t) ->
			t.expect 3
			results = autocomplete.findTokensForFragment 'main'
			t.strictEqual results.length,       1
			t.strictEqual results[0].name,      'main'
			t.strictEqual results[0].relevance, 2
			t.done()

		'finds an match be first letters': (t) ->
			t.expect 3
			results = autocomplete.findTokensForFragment 'mai'
			t.strictEqual results.length,       1
			t.strictEqual results[0].name,      'main'
			t.strictEqual results[0].relevance, 3/4
			t.done()

	findStationsForToken: (t) ->
		t.expect 3
		results = autocomplete.findStationsForToken name: 'station'
		t.strictEqual results.length, 2
		t.ok 'one' in results
		t.ok 'two' in results
		t.done()



	autocomplete:

		'returns an array': (t) ->
			t.expect 2
			t.ok Array.isArray autocomplete '', 3
			t.ok Array.isArray autocomplete 'foo', 3
			t.done()

		'returns an empty array for an empty query': (t) ->
			t.expect 1
			results = autocomplete '', 3
			t.strictEqual results.length, 0
			t.done()

		'sorts by relevance': (t) ->
			t.expect 2
			results = autocomplete 'statio', 3
			t.strictEqual results.length, 2
			t.ok results[0].relevance >= results[1].relevance
			t.done()

		'calculates the relevance correctly': (t) ->
			t.expect 5
			results = autocomplete 'statio', 3
			t.strictEqual results.length, 2
			t.strictEqual results[0].id,        'one'
			t.strictEqual results[0].relevance, 6/7 * Math.sqrt(10) / 2
			t.strictEqual results[1].id,        'two'
			t.strictEqual results[1].relevance, 6/7 * Math.sqrt(20) / 3
			t.done()

		'limits the number of results': (t) ->
			t.expect 1
			t.strictEqual autocomplete('statio', 1).length, 1
			t.done()
