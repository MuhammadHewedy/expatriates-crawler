var express = require('express');
var inspector = require('./inspector.js');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var domain = "https://www.expatriates.com/";
var mongoUrl = 'mongodb://localhost:27017/expatriates';


app.get('/', function(req, res) {

    MongoClient.connect(mongoUrl, function(err, db) {
        inspector.call(domain, parseHome, {
            mongoDb: db
        });
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
        inspector.call(domain + listUrl, parseList, cbParams);

        // TODO handle paging
        // listUrl + n * (100) where n = 1 until we got zero results
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
}

function parsePost($, cbParams) {
    var title = $('title').text();
    var db = cbParams.mongoDb;

    var titlesCollect = db.collection('titles');
    titlesCollect.insertOne({
        title: title
    });
}
