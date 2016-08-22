var cheerio = require('cheerio');
var request = require('request');

module.exports.call = function(url, callback) {
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            console.log(html);
            callback($);
        } else {
            console.error(url, response.statusCode, error);
        }
    });
};
