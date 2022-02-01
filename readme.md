# vbb-stations-autocomplete

*vbb-stations-autocomplete* provides a **stations search for the Berlin Brandenburg public transport service (VBB)**. It pulls its data from [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

*Note*: Because there are ~ `13k` stations, this module contains ~ `800k` of data (~ `240k` gzipped).

[![npm version](https://img.shields.io/npm/v/vbb-stations-autocomplete.svg)](https://www.npmjs.com/package/vbb-stations-autocomplete)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/vbb-stations-autocomplete.svg)
[![gitter channel](https://badges.gitter.im/derhuerst/vbb-rest.svg)](https://gitter.im/derhuerst/vbb-rest)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


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

This returns stations in a reduced form of the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format). To get all details, pass each `id` into [`vbb-stations`](https://github.com/derhuerst/vbb-stations).

```javascript
[
	{
		id: '900000009103', // U Seestr.
		relevance: 2.0817557,
		score: 40.8276194
	}, {
		id: '900000009105', // Seestr./Amrumer Str.
		relevance: 1.0408778,
		score: 15.7013362
	}, {
		id: '900000019103', // Seestr./Beusselstr.
		relevance: 1.3878371,
		score: 12.3226614
	}
]
```

If you set `fuzzy` to `true`, words with a [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) `<= 3` will be taken into account. This is a lot slower though:

test | performance
-----|------------
non-fuzzy – `U mehringdamm` | 325 ops/sec
fuzzy – `U mehrigndamm` | 73 ops/sec


Setting `completion` to `false` speeds things up a lot:

test | performance
-----|------------
completion – `U friedr` | 306 ops/sec
no completion – `U friedr` | 5076 ops/sec

## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/vbb-stations-autocomplete/issues).
