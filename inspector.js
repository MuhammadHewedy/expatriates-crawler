var cheerio = require('cheerio');
var request = require('request');

var success = 0, err = 0, successLinks = [], errorCodes = [];

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
			++success;
			pushUnique(successLinks, url);
        } else {
			++err;
			pushUnique(errorCodes, error.code, 'code', {code: error.code, sampleResponse: html});
            call(url, callback, cbParams);
        }
		console.log('success: ' + success + ', error: ' + err + ', no of success links: ' + successLinks.length);
    });
};

function pushUnique(array, valueToCheck, propToCheck, valueToPush){

	var exists;
	if (valueToPush){
		exists = array.some(function(e){
			return e[propToCheck] === valueToCheck;
		})	
	}else{
		exists = array.indexOf(valueToCheck) > -1;
	}
	
	!exists && (array.push(valueToPush || valueToCheck));
}

module.exports.call = call;
module.exports.errorCodes = errorCodes;