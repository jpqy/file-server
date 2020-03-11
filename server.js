const net = require('net');
const fs = require('fs');
const server = net.createServer();

server.listen(3000);
// , () => {
console.log('Server listening on port 3000!');
// });

server.on('connection', (client) => {
  console.log('New client connected!');
  client.setEncoding('utf8'); // interpret data as text
  client.write('Hello there! Please enter a filename to download: ');

  // Handle receiving file requests from client
  client.on('data', (fileName) => {
    console.log('Received request for file: ', fileName);
    fileName = fileName.trim();
    // fs.access(fileName, fs.constants.F_OK, (error) => {
    //   //console.log('ERROR', err);
    //   //console.log(`${fileName} ${err ? 'does not exist' : 'exists'}`);
    //   if (error && error.code==='ENOENT') {
    //     client.write("Sorry, file doesn't exist!");
    //   } else {
    //     client.write("Sending file...");
    //     //TODO
    //   }
    // });
    fs.readFile(fileName, (error, data) => {
      if (error && error.code === 'ENOENT') {
        client.write("Sorry, file doesn't exist!");
      } else if (error) {
        client.write('Sorry, an unknown error occurred!');
      } else {
        console.log(`Sending ${fileName} to client...`);
        client.write("Sending file...");
        client.write(data);
        //TODO
      }
    });
    //console.log(fileName);
  });

  client.on('end', () => {
    console.log("Someone has disconnected!");
  });
});