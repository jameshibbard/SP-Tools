// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/beautifier.js
var credentials = require('../../../../creds.js');

// Login to WP Dashboard
// Go to New Post Page
// Test that MD is correctly converted to HTML (<blockquote>)
// Test that the Beautify button removes newlines
// Test that MD is correctly converted to HTML (italics)
// Test that the Beautify button removes newlines
//
// Delete post and exit
//
module.exports = {
  'Test MD and Beautify Functionalitys' : function (browser) {
    browser
      .url('https://www.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      .url('https://www.sitepoint.com/wp-admin/post-new.php')
      .waitForElementPresent("#bandaid-beautify", 5000)

      .setValue("#content", `
> Something something something something
> something something something something
> something something something something
> something something something something`)

      .click("#bandaid-md")

      .assert.valueContains("#content", `<blockquote>
  <p>Something something something something
  something something something something
  something something something something
  something something something something</p>
</blockquote>`)

      .click("#bandaid-beautify")

      .assert.valueContains("#content", `<blockquote>
  <p>Something something something something something something something something something something something something something something something something</p>
</blockquote>`)

      .clearValue("#content")

      .setValue("#content", `
So maybe — _maybe_ — I have Java all wrong.
Maybe I've been unfair to it.
_Maybe._

It might be time to re-examine my preconceived notions about Java.
To bust some myths, if you will.`)

      .click("#bandaid-md")

      .assert.valueContains("#content", `<p>So maybe — <em>maybe</em> — I have Java all wrong.
Maybe I've been unfair to it.
<em>Maybe.</em></p>

<p>It might be time to re-examine my preconceived notions about Java.
To bust some myths, if you will.</p>`)

      .click("#bandaid-beautify")

      .assert.valueContains("#content", `<p>So maybe — <em>maybe</em> — I have Java all wrong. Maybe I've been unfair to it. <em>Maybe.</em></p>
<p>It might be time to re-examine my preconceived notions about Java. To bust some myths, if you will.</p>`)

      .click("#delete-action > a")
      .pause(1000)
      .accept_alert()
      .pause(10000)
      .end();
  }
};
