var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	users = {},
	port = 8080;

server.listen(port);

console.log('MyChat');
console.log('---------------------------');
console.log('listening on localhost:' + port);
console.log('---------------------------');

mongoose.connect('mongodb://localhost/mychat01', function(err){
	if(!err){
		console.log('Connected to MongoDB!');
		console.log('---------------------------');
	}
});

var chatSchema = mongoose.Schema({
	user: String,
	color: String,
	msg: String,
	time: String,
	created: {type:Date, default:Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

io.sockets.on('connection', function(socket){
	var query = Chat.find({});
	query.sort('-created').limit(20).exec(function(err, docs){
		if(err) throw err;
		socket.emit('load old msgs', docs);
	});
	
	socket.on('new user', function(data, callback){
		if(data.name in users){
			callback(false);
		}else{
			callback(true);
			socket.username = data.name;
			socket.color = data.color
			users[socket.username] = socket;
			var today = new Date();
			var gettime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
			console.log(socket.username + ' connected.');
			socket.broadcast.emit('user joined', {user:socket.username, color:socket.color, time:gettime});
			users[socket.username].emit('you joined', gettime);
			updateUsers();
		}
	});
	
	function updateUsers(){
		io.sockets.emit('users', Object.keys(users));
		io.sockets.emit('connections', Object.keys(io.sockets.connected).length);
	}
	
	socket.on('send message', function(data, callback){
		var msg = data.trim();
		var today = new Date();
		var gettime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		if(msg.substr(0,3).toLowerCase() === '/w '){
			msg = msg.substr(3);
			var ind = msg.indexOf(' ');
			if(ind !== -1){
				var name = msg.substring(0,ind);
				var msg = msg.substring(ind + 1);
				if(name in users){
					users[name].emit('whisperFrom', {msg:msg, user:socket.username, color:socket.color , time:gettime});
					users[socket.username].emit('whisperTo', {msg:msg, user:name, time:gettime});
				}else{
					callback('OUPS! We can\'t find the specified user...');
					users[socket.username].emit('scroll');
				}
			}else{
				callback('Euh?! Please enter a message to whisper.');
				users[socket.username].emit('scroll');
			}
		}else if(msg.substr(0,2).toLowerCase() === '/w'){
			users[socket.username].emit('whisperHelp', gettime);
		}else if(msg.substr(0,3).toLowerCase() === '/sc'){
			users[socket.username].emit('scroll');
		}else if(msg.substr(0,6).toLowerCase() === '/shrug'){
			msg = '¯\\_(ツ)_/¯';
			var newMsg = new Chat({msg:msg, user:socket.username, color:socket.color, time:gettime});
			newMsg.save(function(err){
				if(err) throw err;
				io.sockets.emit('new message', {msg:msg, user:socket.username, color:socket.color, time:gettime});
				users[socket.username].emit('scroll');
			});
		}else if(msg.substr(0,5).toLowerCase() === '/help'){
			users[socket.username].emit('help', gettime);
		}else{
			var newMsg = new Chat({msg:msg, user:socket.username, color:socket.color, time:gettime});
			newMsg.save(function(err){
				if(err) throw err;
				io.sockets.emit('new message', {msg:msg, user:socket.username, color:socket.color, time:gettime});
				users[socket.username].emit('scroll');
			});
		}
	});
	
	socket.on('disconnect', function(data){
		if(!socket.username) return;
		delete users[socket.username];
		var today = new Date();
		var gettime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
		console.log(socket.username + ' disconnected.');
		socket.broadcast.emit('user left', {user:socket.username, color:socket.color, time:gettime});
		updateUsers();
	});
});