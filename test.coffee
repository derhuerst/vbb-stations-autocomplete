'use strict'

autocomplete = require './index.js'



diffFragments =

	'should find removed tokens': (test) ->
		# qux removed once, bar removed once
		result = autocomplete.diffFragments ['foo', 'bar', 'baz', 'qux'], ['foo', 'baz']
		test.deepEqual {qux: -1, bar: -1}, result
		test.done()

	'should find added tokens': (test) ->
		# bar added twice
		result = autocomplete.diffFragments ['foo', 'baz'], ['foo', 'bar', 'baz', 'bar']
		test.deepEqual {bar: 2}, result
		test.done()

	'with a being empty':

		'should find added tokens': (test) ->
			# foo added, bar added
			result = autocomplete.diffFragments [], ['foo', 'bar']
			test.deepEqual {foo: 1, bar: 1}, result
			test.done()

	'should master the kitchen sink': (test) ->
		# bar added twice, qux added, foo removed
		result = autocomplete.diffFragments ['foo', 'baz'], ['qux', 'bar', 'baz', 'bar']
		test.deepEqual {bar: 2, qux: 1, foo: -1}, result
		test.done()



findTokensByFragment =

	'should exactly match tokens': (test) ->
		result = autocomplete.findTokensByFragment {foo: [], bar: []}, 'bar'
		test.deepEqual result, [['bar', 2]]
		test.done()

	'should match tokens by first letters': (test) ->
		result = autocomplete.findTokensByFragment {abc1: [], abc23: []}, 'abc'
		test.deepEqual result, [
			['abc1',  3/4] # 3 out of 4 letters
			['abc23', 3/5] # 3 out of 5 letters
		]
		test.deepEqual autocomplete.findTokensByFragment({foo: []}, 'bar'), []
		test.done()

	'should return only the top 3 tokens': (test) ->
		result = autocomplete.findTokensByFragment {
			fooAA: [], fooB: [], fooCCC: [], fooDDDD: []
		}, 'foo'
		test.deepEqual result, [
			['fooB',   3/4] # 3 out of 4 letters
			['fooAA',  3/5] # 3 out of 5 letters
			['fooCCC', 3/6] # 3 out of 6 letters
		]
		test.done()



module.exports = {diffFragments, findTokensByFragment}
