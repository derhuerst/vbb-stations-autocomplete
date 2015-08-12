var stations =		require('vbb-static/stations');
var Search =		require('fuse.js');





var db = [], station;
for (station in stations) {
	stations[station].id = station;
	db.push(stations[station]);
}



var autocomplete = new Search(db, {
	shouldSort:	true,
	keys:		[ 'id', 'name' ],
	threshold:	0.3,
	sortFn:		function (a, b) {
		return b.item.weight - a.item.weight;
	}
});



var results = autocomplete.search('hauptbahnhof'), result;
for (result in results) {
	console.log(results[result].name);
}
