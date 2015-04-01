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

function validateIdAsync(fileName, id){
	fs.readFile(fileName, function(err, data){
		if(err)
			return console.log(err);
		var users = JSON.parse(data.toString());
		for(var i = 0; i < users.length; i ++)
			if(users[i].id == id)
				return function() {
					return false;
				}
		return function() {
			return true;
		}
	})
}

function getUsers(){
	var data = fs.readFileSync(_fileName).toString();
	var users;
	if(data != "") {
		users = JSON.parse(data);
	}
	else {
		users = [];
	}
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
	var users = getUsers();
	var mod_users = [];
	for(var i = 0; i < users.length; i++){
		if(users[i].id !== id.id)
		{
			console.log(users[i], id.id);
			mod_users.push(users[i]);
		}
			
	}
	fs.writeFile(_fileName, JSON.stringify(mod_users), function(err){
		if(err)
			return console.log(err);
	});
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
		if(id){
			if(!validateIdAsync(_fileName, id.id)){
				deleteUser(id);
				callback(null);
			}
			else{
				callback("User with given id doesn't exist")
			}
		}
		else
			callback("Invalid object send");
	},

	getAll: function(callback){
		var users = getUsers();
		callback(users);
	}
}