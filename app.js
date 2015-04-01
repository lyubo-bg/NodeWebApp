var http = require('http');
var url = require('url');
var querystring = require('querystring');
var userModule = require('./userModule');

var server = http.createServer(function(request, response)
{
	var requestUrl = request.url.toString();
	if(/^\/hello/.test(requestUrl))
	{
		response.end("Hello Wolrd!");
	}
	else if(/^\/user\/create/.test(requestUrl))
	{
		var urlObj = url.parse(requestUrl);
		var user = querystring.parse(urlObj.query);
		userModule.createUser(user, function(err){
			if(err)
				return response.end(err);
			else
				response.end("User added sucessfully");
		});
	}
	else if(/^\/user\/delete/.test(requestUrl))
	{
		var urlObj = url.parse(requestUrl);
		var id = querystring.parse(urlObj.query);
		console.log(id);
	}
	else if(/^\/user\/all/.test(requestUrl))
	{
		userModule.getAll(function(data){
			response.end(data);
		});
	}
});
server.listen('5544');