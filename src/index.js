'use strict'

const Autocomplete = require('./Autocomplete')





const factory = function (limit) {
	let instance = Object.create(Autocomplete)
	instance.init(limit)
	return instance
}

factory.Autocomplete = Autocomplete

module.exports = factory
