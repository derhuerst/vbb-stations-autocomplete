# vbb-stations-autocomplete

*vbb-stations-autocomplete* provides a **stations search for the Berlin Brandenburg public transport service (VBB)**. It pulls its data from [`vbb-static`](https://github.com/derhuerst/vbb-static).

[![npm version](https://img.shields.io/npm/v/vbb-stations-autocomplete.svg)](https://www.npmjs.com/package/vbb-stations-autocomplete)
[![build status](https://img.shields.io/travis/derhuerst/vbb-stations-autocomplete.svg)](https://travis-ci.org/derhuerst/vbb-stations-autocomplete)
[![dependency status](https://img.shields.io/david/derhuerst/vbb-stations-autocomplete.svg)](https://david-dm.org/derhuerst/vbb-stations-autocomplete)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/vbb-stations-autocomplete.svg)](https://david-dm.org/derhuerst/vbb-stations-autocomplete#info=devDependencies)



## Installing

```shell
npm install vbb-stations-autocomplete
```



## Usage

```javascript
var autocomplete = require('vbb-stations-autocomplete')(2);   // limit by 2
autocomplete('U Amrumer Str');
```

returns a [promise that will resolve](http://documentup.com/kriskowal/q/#tutorial) with

```javascript
[
	{
		id: 9009101,
		name: 'U Amrumer Str. (Berlin)',
		weight: 5759.5,
		relevance: 6
	}, {
		id: 9009272,
		name: 'U Osloer Str. (Berlin) [Bus Tromsöer Str.]',
		weight: 922.5,
		relevance: 6
	}, {
		id: 9110006,
		name: 'U Eberswalder Str. (Berlin)',
		weight: 13476.75,
		relevance: 4
	}
]
```



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-stations-autocomplete/issues).
