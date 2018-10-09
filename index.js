const { Client } = require('pg');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const client = new Client({
  user: 'test',
  //host: '172.17.0.2',
  host: 'localhost',
  database: 'test',
  password: 'test',
  port: 5432,
  statement_timeout: 500
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => { 
  console.log('a user connected')
  socket.on('disconnect', () => console.log('long gone'))
});


client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
    client.query('LISTEN songs'); 
    client.on('notification', function(data) {
      console.log(data);
      io.emit('songs', data.payload );
    })
  }
});

http.listen(3000, function() {
  console.log('listening on *: 3000');
});
