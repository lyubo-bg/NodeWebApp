var http = require('http');
var url = require('url');
var querystring = require('querystring');
var userModule = require('./userModule');

var server = http.createServer(function(request, response)
{
	var requestUrl = request.url.toString();
	if(/^\/hello/.test(requestUrl))
	{
		response.end("Hello World!");
	}
	else if(/^\/user\/create/.test(requestUrl))
	{
		var urlObj = url.parse(requestUrl);
		var user = querystring.parse(urlObj.query);
		userModule.createUserAsync(user, function(msg){
				response.end(msg);
		});
	}
	else if(/^\/user\/delete/.test(requestUrl))
	{
		var urlObj = url.parse(requestUrl);
		var id = querystring.parse(urlObj.query);
		userModule.deleteUserAsync(id, function(err){
			if(err)
				response.end(err);
			else
				response.end("User deleted successfully");
		});
	}
	else if(/^\/user\/all/.test(requestUrl))
	{
		userModule.getAllAsync(function(data){
			response.end(JSON.stringify(data));
		});
	}
});
server.listen('5544');