var express = require('express');
var inspector = require('./inspector.js');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var domain = "https://www.expatriates.com/";
var mongoUrl = 'mongodb://localhost:27017/expatriates';


app.get('/', function(req, res) {

    MongoClient.connect(mongoUrl, function(err, db) {
        inspector.call(domain, parseHome, {mongoDb: db});
        // TODO close db
    });
    res.send("OK");
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

function parseHome($, cbParams) {
    var lists = $('.categories li a').map(function(a) {
        return $(this).attr('href');
    });
    console.log('found ' + lists.length + ' lists');
    lists.each(function(i, listUrl) {
		cbParams.listUrl = listUrl;
        inspector.call(domain + listUrl, parseList, cbParams);
    });
}

function parseList($, cbParams) {
    var posts = $('.main-content li > a').map(function(a) {
        return $(this).attr('href');
    });
    console.log('found ' + posts.length + ' posts');
    posts.each(function(i, postUrl) {
        inspector.call(domain + postUrl, parsePost, cbParams);
    });
	
	// paging
	if (($('.pagination a.active').text() || 0) == 1){	// in the landing page of the list
		var toPage = $('.pagination a:nth-last-child(2)').text() || 0;
		if (toPage > 1){
			console.log('found ' + toPage + ' pages for list ' + cbParams.listUrl);
			for (var i = 1; i < toPage; i++){
				inspector.call(domain + cbParams.listUrl + "/index" + i * 100 + ".html", parseList, cbParams);
			}
		}
	}
}

function parsePost($, cbParams) {
    var postObj = {};

    postObj.title = $('.container h1').text().trim();

    $('.no-bullet li:has(strong)').each(function(i) {
        var kv = $(this).text().split(':');
        postObj[kv[0].toLowerCase()] = kv[1];
    });

    postObj.phone = $('.posting-phone a').text();
    postObj.desc = $('.post-body').text().trim();
    $('.posting-images img').each(function(i) {
        postObj["img_" + i] = $(this).attr('src');
    });

    cbParams.mongoDb.collection('posts').insertOne(postObj, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}
