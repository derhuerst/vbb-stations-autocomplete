'use strict'

const {Suite} = require('benchmark')

const autocomplete = require('.')

new Suite()

.add('basic query, one token', function () {
	autocomplete('Bellevue', 3)
})
.add('basic query, two tokens', function () {
	autocomplete('U Seestr.', 3)
})
.add('no completion – "U friedr"', function () {
	autocomplete('U friedr', 3, false, false)
})
.add('completion – "U friedr"', function () {
	autocomplete('U friedr', 3, false, true)
})
.add('completion – "meh"', function () {
	autocomplete('meh', 3, false)
})
.add('complex', function () {
	autocomplete('S+U Warschauer Straße', 3)
})
.add('umlauts', function () {
	autocomplete('U märkisches museum', 3)
})
.add('non-fuzzy – "U mehringdamm"', function () {
	autocomplete('U mehringdamm', 3)
})
.add('fuzzy – "U mehrigndamm"', function () {
	autocomplete('U mehrigndamm', 3, true)
})

.on('cycle', (e) => {
	console.log(e.target.toString())
})
.run()
