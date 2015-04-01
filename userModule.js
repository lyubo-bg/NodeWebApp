var fs = require('fs');

var _fileName = getFileName();

function validateId(fileName, id){
	stringData = fs.readFileSync(fileName).toString();
	if(stringData !== ""){
		var users = JSON.parse(stringData);
		for(var i = 0; i < users.length; i ++)
			if(users[i].id == id)
				return false;
	}
	return true;
}

function getUsers(){
	var data = fs.readFileSync(_fileName).toString();
	var users = JSON.parse(data);
	return users;
}

function getFileName(){
	var data = fs.readFileSync("./config.txt");
	return data.toString();
}

function writeUserToFile(user){
	var users = getUsers();
	users.push(user);
	fs.writeFile(_fileName, JSON.stringify(users), function (err) {
  		if (err) 
  			console.log("Couldn't add user to file");
	});
}

function deleteUser(id){
	fs.readFile(fileName, function(err, data){
		var result = [];
		if(err)
			return console.log("There was an error: ", err);
		stringData = data.toString();
		var users = JSON.parse(stringData);
		for(var i = 0; i < users.length; i ++){
			if(users[i].id === id)
				continue;
			else
				result.push(users[i]);
		}
		fs.writeFile(fileName, function(err){
			if(err)
				console.log('There was an error: ', err);
		});
	})
}

module.exports = {
	createUser: function(user, callback){
		if(user.id && user.username){
			if(validateId(_fileName, user.id)){
				writeUserToFile(user);
				callback(null);
			}
			else
				callback("Could not create user. Reason - id duplication");
		}
		else
			callback("Invalid object send");
	},

	deleteUser: function(id, callback){
		if(id.id){
			if(!validateId(_fileName, id.id)){
				deleteUser(id.id);
				callback(true);
			}
		}
		else
			callback(false);
	},

	getAll: function(callback){
		var users = getUsers();
		callback(users);
	}
}