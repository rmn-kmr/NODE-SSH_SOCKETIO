var express = require('express');
var app = express();
const server = require('http').createServer(app);
const SocketConn = require('./src/helpers/socketConnection');
var term = require('term.js');

port = process.env.PORT || 2000;


app.use(term.middleware());
app.use(express.static(__dirname+'/public/'));

let socketConnection = new SocketConn(server); 
socketConnection.init(); // initialize socket connection

// start server
server.listen(port, ()=>{
   console.log(`Server is running on ${port}`);
   
 });
