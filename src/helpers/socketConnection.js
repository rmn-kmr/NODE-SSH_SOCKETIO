const server = require('http').createServer();
const socket = require('socket.io');
const SshConnect = require('./sshConnection');

class SocketConn {

    constructor(server){
        this.server = server;
        this.io = socket(server); 
    }

    init(){

        const self = this;
        // listening new client connection to socket
        self.io.on('connection', client => {
            console.log('new client connected');
            let sshConnObj = {};

            // listening 'connect-ssh' event to make connection to remote server
            client.on('connect-ssh', (serverData) => { 
                let token = 1;
                serverData.forEach(data => {
                    let {terminal, username, host, password} = data;
                    let sshConn = new SshConnect({terminal: terminal, socket: client, proxyInstance: token++, host:host, port: 22, username: username, password: password });
                    sshConn.init();
                    sshConnObj[terminal] = sshConn;
                });
                
            });

            // listening 'execute-cmd' event to execute command on remote server
            client.on('execute-cmd', (data) => {
                console.log('data', data);
                
                let { terminal, command } = data;
                let sshConn = sshConnObj[terminal];
                sshConn.executeCommand(command); 
                
              });

            client.on('disconnect', () => { 
                sshConnObj = {};
                console.log('client dissconnected');
             });
          });
    }
}
module.exports = SocketConn;