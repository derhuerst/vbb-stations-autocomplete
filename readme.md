# vbb-stations-autocomplete

*vbb-stations-autocomplete* provides a **stations search for the Berlin Brandenburg public transport service (VBB)**. It pulls its data from [`vbb-static`](https://github.com/derhuerst/vbb-static).

[![npm version](https://img.shields.io/npm/v/vbb-stations-autocomplete.svg)](https://www.npmjs.com/package/vbb-stations-autocomplete)
[![build status](https://img.shields.io/travis/derhuerst/vbb-stations-autocomplete.svg)](https://travis-ci.org/derhuerst/vbb-stations-autocomplete)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-stations-autocomplete.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)


## Installing

```shell
npm install vbb-stations-autocomplete
```


## Usage

```js
autocomplete(query, results = 3, fuzzy = false, completion = true)
```

```javascript
const autocomplete = require('vbb-stations-autocomplete')
autocomplete('Seestr', 3)
```

This returns stations in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

```javascript
[
	{
		id: '900000009103',
		relevance: 2.08113883008419,
		score: 187.63460439121263,
		type: 'station',
		name: 'U Seestr.',
		weight: 8128.75,
		tokens: 2
	}, {
		id: '900000009105',
		relevance: 1.3874258867227933,
		score: 94.23522862823623,
		type: 'station',
		name: 'Seestr./Amrumer Str.',
		weight: 4613.25,
		tokens: 3
	}, {
		id: '900000019103',
		relevance: 2.08113883008419,
		score: 74.67490370756026,
		type: 'station',
		name: 'Seestr./Beusselstr.',
		weight: 1287.5,
		tokens: 2
	}
]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though:

test | performance
-----|------------
non-fuzzy – `U mehringdamm` | 294 ops/sec
fuzzy – `U mehrigndamm` | 85.85 ops/sec


Setting `completion` to `false` speeds things up slightly:

test | performance
-----|------------
completion – `U friedr` | 281 ops/sec
no completion – `U friedr` | 432 ops/sec

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-stations-autocomplete/issues).
