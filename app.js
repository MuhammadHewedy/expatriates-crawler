#! /usr/bin/env node

var inspector = require('./inspector.js');
var MongoClient = require('mongodb').MongoClient;

var domain = "https://www.expatriates.com/";
var mongoUrl = 'mongodb://localhost:27017/expatriates';

MongoClient.connect(mongoUrl, function(err, db) {
    inspector.call(domain, parseHome, { db: db });
    // TODO close db
});

function parseHome($, cbParams) {
    var lists = $('.categories li a').map(function(i) {
        return $(this).attr('href');
    });
	
	console.log('found ' + lists.length + ' lists');
	
    lists.each(function(i, listUrl) {
		var newCbParams = extend(cbParams, {listNo : i, listUrl: listUrl});
        inspector.call(domain + listUrl, parseList, newCbParams);
    });
}

function parseList($, cbParams) {
	console.log('parsing list #' + cbParams.listNo + ' with url: ' + cbParams.listUrl);
	
    var posts = $('.main-content li > a').map(function(i) {
        return $(this).attr('href');
    });

    if (posts.length === 0) {
        console.log('ERROR: 0 posts for: ' + cbParams.listUrl);
    }
    posts.each(function(i, postUrl) {
		var newCbParams = extend(cbParams, {postNo: i, postUrl: postUrl});
        inspector.call(domain + postUrl, parsePost, newCbParams);
    });

    // paging
    if (($('.pagination a.active').text() || 0) == 1) { // in the landing page of the list
        var toPage = $('.pagination a:nth-last-child(2)').text() || 0;
        if (toPage > 1) {
            for (var i = 1; i < toPage; i++) {
				var newCbParams = extend(cbParams, {listUrl: cbParams.listUrl + "/index" + i * 100 + ".html"});
                inspector.call(domain + newCbParams.listUrl, parseList, newCbParams);
            }
        }
    }
}

function parsePost($, cbParams) {
	console.log('parsing post #' + cbParams.postNo + ' with url: ' + cbParams.postUrl + ' of listUrl: ' + cbParams.listUrl);
	
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

    cbParams.db.collection('posts').insertOne(postObj, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

function extend(o, propsObj){
	var newO = {};
	Object.keys(o).forEach(function(key){
		newO[key] = o[key];
	});
	Object.keys(propsObj).forEach(function(key){
		newO[key] = propsObj[key];
	});
	return newO;
}
