var jsdom = require('jsdom');

var jqueryUrl = "http://code.jquery.com/jquery.js";

module.exports.call = function(url, callback) {
    jsdom.env(url, [jqueryUrl],
        function(err, window) {
            console.log('window: ', typeof window, '; url: ', url);
            callback(window.$);
        }
    );
};;
