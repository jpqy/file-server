const net = require('net');
const stdin = process.stdin; // Handles input for requesting

let requestedFile;
let awaitingFile = false;
const conn = net.createConnection({
  host: 'localhost', // change to IP address
  port: 3000
});

conn.setEncoding('utf8'); // interpret data as text
stdin.setEncoding('utf8'); // interpret data as text

conn.on('connect', () => {
  //conn.write('Hello from client!');
});

// Handles receiving data
conn.on('data', (data) => {
  //console.log('Requested file: ', requestedFile);
  //console.log('Returned data: ', data.trim());
  //console.log('requested = returned? ', data.trim() === requestedFile);

  if (requestedFile && (data.trim() == requestedFile)) {
    console.log('Server about to send us the file!');
    awaitingFile = true;
  } else if (awaitingFile) {
    console.log('Here is our data: ', data);
    awaitingFile = false;
  } else {
    console.log('Server says: ', data);
  }
});

stdin.on('data', (input) => {
  //console.log("Requested: ", input);
  requestedFile = input.trim();
  conn.write(input);
});