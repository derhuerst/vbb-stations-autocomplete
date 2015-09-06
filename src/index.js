var Autocomplete =	require('./Autocomplete');





var factory = module.exports = function (limit) {
	var instance = Object.create(Autocomplete);
	instance.init(limit);
	return instance;
};

factory.Autocomplete = Autocomplete;
