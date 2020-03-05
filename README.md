# SP Tools

A Chrome extension to help with various SitePoint editing tasks.

Install via [this link](https://chrome.google.com/webstore/detail/sp-tools/giiilbcilmcnknhepiaakljffflmopkn).

## Functionality

The extension runs on the main site and on the WordPress backend.

### Frontend

On channel pages and on post pages, it hides the following elements:

- Share widget
- Web push notifications widget
- Accesiblity widget
- Featured posts
- Privacy popup trigger
- Offers bar

It also adds an _Open in Google Analytics_ link to posts. Clicking on this will take you to the post's Google Analytics page. Obviously, this relies on you being logged in to Google Analytics.

Infinite scroll is disabled for post pages.

### Backend

In the WordPress backend, the extension adds the following:

- An _MD_ button which converts the contents of the editor pane from Markdown to HTML.
- A _Capitalize and Check_ button which converts post title to [title case](http://www.grammar-monster.com/lessons/capital_letters_title_case.htm).
- Headline Analysis. When you click _Capitalize and Check_ button, you will see a small slider animate underneath the heading to indicate the post title's score. Clicking on the slider will toggle a pane beneath the title field which gives you a score out of 100 and feedback on your choice of title.
- A _Capitalize Subheadings_ button which checks the remaining headings in the article for title capitalization.
- A *Copy Link* button which copies the post's current permalink to the clipboard.
- A  _Rebuild Link_ button which rebuilds the post's permalink. This is useful, for example, when WordPress creates a permalink based on a draft heading which subsequently changes.
- An extensible [molly-guard](http://www.urbandictionary.com/define.php?term=molly-guard) which performs a number of checks and disables / enables the publish button accordingly.
  - A sensible post permalink
  - Presence of relative relative URLs (a URL that doesn't explicitly specify the protocol) in the editor pane
  - Presence of empty links (i.e. `<a href="">`) in the editor pane
  - Presence of `<h1>` tags in the editor pane (no posts should have these)
  - Presence of an `[author_more]` tag in the excerpt
  - Presence of the peer review credit in the excerpt
  - `[special]` shortcode tags are swapped out in the excerpt for their HTML counterparts (`<p class="wp-special">...</p>`)
- Clicking into the _Publish_ field will open a date picker, allowing you to more comfortably select the date on which the post is to be published. Remember the times shown are in [Pacific Standard Time](https://www.timeanddate.com/time/zones/pst).
- It adds a checkbox to the categories widget. Clicking this when composing a _new_ post, will toggle any categories that are not associated with your particular channel. You can set your channel on the extension's options page.
-  A _Copy Tags_ button which gives you a comma separated list of tags copied to the clipboard.

### Context Menu

Right clicking on an article tile on any channel page will offer the following options:

-   _Copy target description_: copies the post's short description to the clipboard.
-   _Copy target title_: copies the post's title to the clipboard.

Right clicking anywhere on a post page will offer the following options:

-   _Copy description_: copies the post's short description to the clipboard.
-   _Copy title_: copies the post's title to the clipboard.

Right clicking any link on any page will offer you the option of copying it to the clipboard in Markdown format:

```markdown
[xxx](the-address-of-the-link-you-clicked)
```

If you highlight the link's text and then right click, the link will be copied to the clipboard as:

```markdown
[link-text-you-highlighted](the-address-of-the-link-you-clicked)
```

### Options

To access the options page, click the extension's icon in your browser bar and select _Options_.

The options are as follows:

-   _Set SitePoint Channel_: Set your channel here. The _Toggle Categories_ feature in WordPress relies on this.
-   _Clean up UI_: Toggle hiding of superfluous UI elements (requires page refresh to take effect)
-  _Disable infinite scroll_: Toggles infinite scroll on/off  (requires page refresh to take effect)

## Tests

- Clone repo
- Ensure that Node and npm are installed on your machine ([guide](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/)).
- Run `npm install` to install project dependencies

### Integration

The integration tests use [Nightwatch.js](https://github.com/nightwatchjs/nightwatch).

When running the backend tests, Nightwatch expects a `creds.js` file to be present one level above the repo (in the repo's containing directory). This file should export an object with a `username` and `password` property, which will be used to log into the WP backend.

```javascript
module.exports = {
  username: 'user',
  password: 'pass'
};
```

To run all the integration tests: `npm run nightwatch`.
To run an individual test append the test path to the above command: `npm run nightwatch tests/integration/tests/wordpress.js`

### Unit

The unit tests use the [Mocha](https://mochajs.org/) framework.

To run, install the project dependencies as above, then run `npm run test`.
