# linkedin-canonical-url

LinkedIn urls are "*localized*" to various markets,
this micro-module creates a canonical url from any international one.

[![Build Status](https://travis-ci.org/akitten/linkedin-canonical-url.svg)](https://travis-ci.org/akitten/linkedin-canonical-url)
[![codecov.io](https://codecov.io/github/akitten/linkedin-canonical-url/coverage.svg?branch=master)](https://codecov.io/github/akitten/linkedin-canonical-url?branch=master)
[![Code Climate](https://codeclimate.com/github/akitten/linkedin-canonical-url/badges/gpa.svg)](https://codeclimate.com/github/akitten/linkedin-canonical-url)
[![Dependency Status](https://david-dm.org/akitten/linkedin-canonical-url.svg)](https://david-dm.org/akitten/linkedin-canonical-url)
[![devDependency Status](https://david-dm.org/akitten/linkedin-canonical-url/dev-status.svg)](https://david-dm.org/akitten/linkedin-canonical-url#info=devDependencies)

## Why?

It *can* appear that a single person has multiple possible URLs and therefore its possible to have duplicate profiles. We don't like duplicate data. So we need a way of transforming the URL for any "local" version of LinkedIn into its "***canonical***" (*unique*) version.

## What?

Given an international LinkedIn URL such as:  
https://uk.linkedin.com/in/john-smith-82a505  
into the canonical version:
https://www.linkedin.com/in/john-smith-82a505

This is a relatively *simple* example. The interesting one is where
LinkedIn appends *noise* in the url e.g:  
https://sy.linkedin.com/pub/krzysztof-marzec/a7/576/b50?trk=biz_employee_pub  
Which gets re-directed to:  
https://www.linkedin.com/in/krzysztof-marzec-b50576a7

*Thankfully* there *is* a ***pattern*** so we can transform the urls.

## How?

```sh
npm install linkedin-canonical-url --save
```

Then in your script:

```js
var transform_linkedin_url = require('linkedin-canonical-url');
var local_url = 'https://sy.linkedin.com/pub/krzysztof-marzec/a7/576/b50?trk=biz_employee_pub';
var canonical_url = transform_linkedin_url(local_url);
console.log('Transformed: ', canonical_url);
// https://www.linkedin.com/in/krzysztof-marzec-b50576a7
```

That's it.  
Now each time you see a LinkedIn URL pass it through this transformer
to ensure that you are getting the ***canonical*** version.

> **Note**: the transformer is written to be human-readable.
If you run into a "*performance-bottleneck*" using this code,
please feel free to submit a PR to make it faster.
