# damnGdpr

Multi-language alerts made to comply with GDPR

## How it works

The plugin displays a generic warning about cookies with two buttons: Accept and Decline. When Accept is clicked, it re-saves every cookie you specified inside `cookieNames[]` with an expiration date of a year from now.

This means you should've first saved all of those cookies without specifying an expiration date, thus making them expire as soon as the session is finished.

If Decline is clicked, all of the listed cookies are re-saved without an expiration date.

## Usage 

Include the dependencies

```
<script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>
```

Include the plugin

```
<script src="https://cdn.jsdelivr.net/npm/damngdpr/src/damnGdpr.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/damngdpr/src/damnGdpr.min.css">
```

Initialize

```
$.damnGdpr({
    language: 'en',
    readMoreUrl: 'https://www.website.com/privacy-policy',
    cookieNames: [
        "cookie1",
        "cookie1"
    ]
})
```