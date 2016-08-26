var cheerio = require('cheerio');
var request = require('request');
var myUtil = require('./util');

var success = 0, err = 0, successLinks = [], errorCodes = [];

var call = function(url, callback, cbParams) {
    request({
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
        },
        "url": url
    }, function(error, response, html) {
        if (!error) {
        	++success;
            var $ = cheerio.load(html);
            callback($, cbParams);
			successLinks.indexOf(url) < 0 && successLinks.push(url);
        } else {
			++err;
            //call(url, callback, cbParams);
            saveErrors(error, html);
        }
		console.log('success: ' + success + ', error: ' + err + ', no of success links: ' + successLinks.length);
    });
};

function saveErrors(error, html) {
	var exitedError = errorCodes.find(function(o) {
		return o.code == error.code;
	});

	if (exitedError) {
		++exitedError.frequency;
	} else {
		errorCodes.push({
			code : error.code,
			frequency : 1,
			sampleResponse : html
		});
	}
}

module.exports.call = call;
module.exports.errors = errorCodes;