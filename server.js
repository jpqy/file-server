const net = require('net');
const fs = require('fs');
const EOF = 'THEFILEHASENDED';
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
    fileName = fileName.trim(); // Must trim out newline character

    fs.readFile(fileName, 'binary', (error, data) => {
      if (error && error.code === 'ENOENT') {
        client.write("Sorry, file doesn't exist!");
      } else if (error) {
        client.write('Sorry, an unknown error occurred!');
      } else {
        console.log(`Sending ${fileName} to client...`);

        // Send the filename so client knows file is coming
        client.write(`${fileName}\n`);

        // Send the file itself
        setTimeout(() => { client.write(data); }, 1000);
      }
    });
  });

  client.on('end', () => {
    console.log("Someone has disconnected!");
  });
});