var cheerio = require('cheerio');
var request = require('request');

var sCount = 0,
    eCount = 0;

var call = function(url, callback, cbParams) {
    request({
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
        },
        "url": url
    }, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            callback($, cbParams);
            sCount++;
        } else {
            // console.error(url, error.code);
            // eCount++;
            call(url, callback, cbParams);
        }
        console.log(sCount, eCount);
    });
};

module.exports.call = call;
