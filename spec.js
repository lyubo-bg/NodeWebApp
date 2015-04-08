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
  beforeEach(function(){
    fs.truncateSync('./users.json', 0);
  })

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
      var user = {id: '1', username: 'test'};
      Post(user, '/user/create', function(r){
        assert.equal(JSON.stringify(user), r);
        done();
      });
    });

    it("shouldn't create user", function(done){
      fs.writeFileSync("./users.json", JSON.stringify([{id: 1, username: "test"}]));
      Post({id: '1', username: 'newtest'}, '/user/create', function(r){
        done(assert.equal("Could not create user. Reason - id duplication", r))
      })
    });
  });

  describe("delete user", function(){
    it("shouldn't delete user", function(done){
      Post({id:1}, '/user/delete/', function(r){
        done(assert.equal("User with given id doesn't exist", r));
      });
    })

    it("should delete user", function(done){
      var user = {id: '1', username: 'test'};
      Post(user, '/user/create', function(r){
        assert.equal(JSON.stringify(user), r);
        Post({id: 1}, '/user/delete/', function(r2){
          assert.equal("User deleted successfully", r2);
          done();
        });
      });
    });
  });

  describe("get all users", function(){
    it("should get one user", function(done){
      var user = {id: '1', username: 'test'};
      Post(user, '/user/create', function(r){
        assert.equal(JSON.stringify(user), r)
        http.get("http://localhost:5544/user/all", function(response){
          response.on('data', function(data){
            //var _user = JSON.parse(data.toString());
            done(assert.equal(JSON.stringify([user]), data.toString()));
          })
        })
      })
    });

    it("should get all users", function(done){
      var userOne = {id: '1', username: 'sam'};
      var userTwo = {id: '2', username: 'john'};
      Post(userOne, '/user/create', function(r1){
        assert.equal(JSON.stringify(userOne), r1)
        Post(userTwo, '/user/create', function(r2){
          assert.equal(JSON.stringify(userTwo), r2)
          http.get("http://localhost:5544/user/all", function(response){
            response.on('data', function(data){
              var users = JSON.parse(data.toString());
              done(assert.equal(JSON.stringify([userOne, userTwo]), data.toString()));
            })
          })
        })
      })
    });
  });
});
