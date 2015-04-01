var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response)
{
	var responseUrl = request.url.toString();
	if(/^\/hello/.test(responseUrl))
	{
		response.end("Hello Wolrd!");
	}
	else if(/^\/user\/create/.test(responseUrl))
	{
		var urlObj = url.parse(responseUrl);
	}
});
server.listen('5544');