var app = require('./app.js');
var http = require('http');
var assert = require('assert');

describe("MyApp", function() {
  describe("hello", function() {
      it("should say hello", function(){
        http.get("http://localhost:5544/hello", function(response){
          response.on('data', function(data){
            assert.equal("Hello World!", data.toString());
          });
        })
      });
 });

  describe("create user", function(){
    it("should create user", function(){

    })
  })
});