var Autocomplete =	require('./Autocomplete');





module.exports = function () {
	var instance = Object.create(Autocomplete);
	instance.init();
	return instance;
};
