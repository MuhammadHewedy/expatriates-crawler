var express = require('express');
var inspector = require('./inspector.js');

var app = express();
var domain = "https://www.expatriates.com/";

app.get('/', function(req, res) {
    inspector.call(domain, parseHome);
    res.send("OK");
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});


function parseHome($) {
    var lists = $('.categories li a').map(function(a) {
        return $(this).attr('href');
    });
    console.log('found ' + lists.length + ' lists');
    lists.each(function(i, listUrl) {
        inspector.call(domain + listUrl, parseList);

        // TODO handle paging
        // listUrl + n * (100) where n = 1 until we got zero results
    });
}

function parseList($) {
    var posts = $('.main-content li > a').map(function(a) {
        return $(this).attr('href');
    });
    console.log('found ' + posts.length + ' posts');
    posts.each(function(i, postUrl) {
        inspector.call(domain + postUrl, parsePost);
    });
}

function parsePost($) {}
