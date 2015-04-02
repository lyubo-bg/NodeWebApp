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

function exists(fileName, id, callback){
	fs.readFile(fileName, function(err, data){
		if(err)
			return console.log(err);
		if(data.toString() != ""){
			var users = JSON.parse(data.toString());
			for(var i = 0; i < users.length; i ++)
				if(users[i].id == id.id)
				{
					return callback(true);
				}
			callback(false);
		}
		else
			callback(false);
	});
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

function getUsersAsync(callback){
	fs.readFile(_fileName, function(err, data){
		var users;
		if(data.toString() != "")
			users = JSON.parse(data.toString());
		else
			users = [];
		callback(users);
	})
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

function writeUserToFileAsync(user){
	getUsersAsync(function(users){
		users.push(user);
		fs.writeFile(_fileName, JSON.stringify(users), function(err){
			if(err)
				console.log("Couldn't add user to file");
		});
	});
}

function deleteUser(id){
	var users = getUsers();
	var mod_users = [];
	for(var i = 0; i < users.length; i++){
		if(users[i].id !== id.id)
		{
			mod_users.push(users[i]);
		}	
	}
	fs.writeFile(_fileName, JSON.stringify(mod_users), function(err){
		if(err)
			return console.log(err);
	});
}

function deleteUserAsync(id){
	getUsersAsync(function(users){
		var mod_users = [];
		for(var i = 0; i < users.length; i++){
			if(users[i].id !== id.id)
			{
				mod_users.push(users[i]);
			}	
		}
		fs.writeFile(_fileName, JSON.stringify(mod_users), function(err){
			if(err)
				return console.log(err);
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

	createUserAsync: function(user, callback){
		if(user.id && user.username){
			exists(_fileName, {id: user.id}, function(valid){
				if(!valid){
					writeUserToFileAsync(user);
					callback(JSON.stringify(user));
				}
				else
					callback("Could not create user. Reason - id duplication");
			})
		}
		else
			callback("Invalid object send");
	},

	deleteUser: function(id, callback){
		if(id){
			if(!validateId(_fileName, id.id)){
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

	deleteUserAsync: function(id, callback){
		exists(_fileName, id, function(valid){
			if(id.id){
				if(valid){
					deleteUserAsync(id);
					callback(null);
				}
				else{
					callback("User with given id doesn't exist")
				}
			}
			else
				callback("Invalid object send");
		})
	},

	getAll: function(callback){
		var users = getUsers();
		callback(users);
	},

	getAllAsync: function(callback){
		getUsersAsync(callback);
	}
}