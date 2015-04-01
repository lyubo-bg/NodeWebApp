var fs = require('fs');

var _fileName = getFileName();

function validateId(fileName, id){
	fs.readFile(fileName, function(err, data){
		if(err)
			return console.log("There was an error: ", err);
		stringData = data.toString();
		var users = JSON.parse(stringData);
		for(var i = 0; i < id; i ++){
			if(users[i].id === id)
				return false;
		}
		return true;
	})
}

function getUsers(){
	var data = fs.readFileSync(fileName).toString();
	var users = JSON.parse(data);
	return users;
}

function getFileName(){
	var data = fs.readFileSync("./config.txt");
	return data.toString();
}

function writeUserToFile(user){
	fs.appendFile(_fileName, JSON.stringify(user), function (err) {
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
		if(validateId(_fileName, user.id))
			writeUserToFile(user);
	},
	
	deleteUser: function(id, callback){
		if(!validateId(_fileName, id.id)){
			deleteUser(id.id);
			callback(true);
		}
	},

	getAll: function(callback){
		var users = getUsers();
		callback(users);
	}
}