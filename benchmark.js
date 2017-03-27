'use strict'

const {Suite} = require('benchmark')

const autocomplete = require('.')

new Suite()

.add('basic query, one token', function () {
	autocomplete('Bellevue', 3)
})
.add('basic query, two tokens', function () {
	autocomplete('Seestr.', 3)
})
.add('completion – "U friedr"', function () {
	autocomplete('U friedr', 3)
})
.add('completion – "meh"', function () {
	autocomplete('Bellevue', 3)
})
.add('complex', function () {
	autocomplete('S+U Warschauer Straße', 3)
})
.add('umlauts', function () {
	autocomplete('U märkisches museum', 3)
})

.on('cycle', (e) => {
	console.log(e.target.toString())
})
.run()