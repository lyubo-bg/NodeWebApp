var app = require('./app.js');
var http = require('http');
var assert = require('assert');
var querystring = require('querystring');
var fs = require('fs');

function Post(data, query, callback){
  var data = querystring.stringify({
      id: data.id,
      username: data.username
    });

  var options = {
    hostname: 'localhost',
    port: 5544,
    path: query + '?' + data,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
  };

  var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          callback(chunk);
      });
  });

  req.end(data);
}

describe("MyApp", function() {
  // beforeEach(function(){
  //   fs.truncate('./users.json', 0, function(){});
  // })

  describe("hello", function() {
    it("should say hello", function(done){
      http.get("http://localhost:5544/hello", function(response){
        response.on('data', function(data){
          done(assert.equal("Hello World!", data.toString()));
        });
      })
    });
  });

  describe("create user", function(){
    it("should create user", function(done){
      Post({id: '1', username: 'test'}, '/user/create', function(r){
        done(assert.equal(JSON.stringify({id:'1', username: 'test'}), r));
      });
      Post({id: '1', username: 'asd'}, '/user/create', function(r) {
        done(assert.equal("Could not create user. Reason - id duplication", r))
      })
    });
  })
});