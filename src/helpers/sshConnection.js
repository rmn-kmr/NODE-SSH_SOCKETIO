var Client = require('ssh2').Client;
class SshConnect {
 

    constructor({ terminal, socket, proxyInstance, host, port, username, password }) {
      this.socket = socket;
      this.port = port;
      this.username = username;
      this.password = password;
      this.conn = new Client();
      this.connected = false;
      this.host = host;
      this.terminal = terminal;
      this.isSSHConnected = false;
      this.stream = null;
    }

    init() {
        const self = this;

        // SSH onConnection  error event
        self.conn.on('error', (error)=>{
            self.isSSHConnected = false;
            console.log('ssh-error', error);  
        });

        // SSH onConnection ready event 
        // call when system successfully connects with remote server
        self.conn.on('ready', () => {
          console.log('ssh-ready');
          self.isSSHConnected = true;
          // connects with remote server shell to transfer data using stream
          self.conn.shell(function(err, stream) {
            if (err) throw err;
            self.stream = stream;
            stream.on('close', function() {
              console.log('Stream :: close');
              self.conn.end();
              self.conn = null;
            }).on('data', function(data) {
              console.log('OUTPUT: ' + data); 
              self.socket && self.socket.emit('cmd-output', {terminal: self.terminal, data:data.toString('utf-8')});
            });
    
            
          });
        }).connect({
            host: self.host,
            port: self.port,
            username: self.username,
            password: self.password
           // privateKey: require('fs').readFileSync('/home/rmn/.ssh/id_rsa')
        });
    }

    executeCommand = ( data ) => {
      const self = this;
      console.log('#-------------------');
      
      if (self.conn && self.stream ) self.stream.write(data);
    }
    

}
module.exports = SshConnect;