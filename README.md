# vbb-stations-autocomplete

*vbb-stations-autocomplete* provides a **stations search for the Berlin Brandenburg public transport service (VBB)**. It pulls its data from [`vbb-static`](https://github.com/derhuerst/vbb-static).

[![npm version](https://img.shields.io/npm/v/vbb-stations-autocomplete.svg)](https://www.npmjs.com/package/vbb-stations-autocomplete)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-stations-autocomplete.svg)](https://david-dm.org/derhuerst/vbb-stations-autocomplete)



## Installing

```shell
npm install vbb-stations-autocomplete
```



## Usage

```javascript
var autocomplete = require('vbb-stations-autocomplete')(2);   // limit by 2
```

```javascript
stations.suggest('U Amrumer Str');
```

returns a [promise that will resolve](http://documentup.com/kriskowal/q/#tutorial) with

```javascript
[
	{
		id: 9009101,
		name: 'U Amrumer Str. (Berlin)',
		weight: 10125,
		relevance: 6
	}, {
		id: 9009272,
		name: 'U Osloer Str. (Berlin) [Bus Tromsöer Str.]',
		weight: 3075,
		relevance: 6
	}
]
```



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-stations-autocomplete/issues).
