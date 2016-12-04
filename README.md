# SP Tools

A Chrome extension to help with various SitePoint editing tasks.

For documentation of the available functionality, consult [the wiki](https://github.com/sitepoint-editors/SP-Tools/wiki).

Install via [this link](https://chrome.google.com/webstore/detail/sp-tools/giiilbcilmcnknhepiaakljffflmopkn).

## Tests

- Clone repo
- Ensure that Node and npm are installed on your machine ([guide](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/)).
- Run `npm install` to install project dependencies

### Integration
The integration tests use [Nightwatch.js](https://github.com/nightwatchjs/nightwatch). Nightwatch uses the Selenium standalone server (v 2.x) and the Chrome webdriver (latest), which it expects to be present in `tests/integration/bin`. These can be downloaded manually from the respective websites ([Selemnium](http://selenium-release.storage.googleapis.com/index.html) | [Chrome](https://sites.google.com/a/chromium.org/chromedriver/downloads)), or automatically on 64-bit Linux by running `npm run get-deps`. The Selenium standalone server is written in Java, so that should also be installed. For more info on getting up and running with Nightwatch, see: [JavaScript Functional Testing with Nightwatch.js](https://www.sitepoint.com/javascript-functional-testing-nightwatch-js/).

The integration tests are also expecting a `creds.js` file to be present one level above the repo (in the repo's containing directory). This file should export an object with a `username` and `password` property, which will be used to log into the WP backend.

```javascript
module.exports = {
  username: 'user',
  password: 'pass'
};
```

To run all the integration tests: `npm run nightwatch`.
To run an individual test append the test path to the above command: `npm run nightwatch tests/integration/tests/beautifier.js`

### Unit

A WIP. The unit tests use the [Mocha](https://mochajs.org/) framework.

To run, install the project dependencies as above, then run `npm run test`.

