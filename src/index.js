var Autocomplete =	require('./Autocomplete');





var factory = module.exports = function () {
	var instance = Object.create(Autocomplete);
	instance.init();
	return instance;
};

factory.Autocomplete = Autocomplete;
