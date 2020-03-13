const net = require('net');
const stdin = process.stdin; // Handles input for requesting
const fs = require('fs');
const EOF = 'THEFILEHASENDED';

let requestedFile; // Stores filename being requested
let awaitingFile = false; // Stores whether server is about to send the file
const conn = net.createConnection({
  host: 'localhost', // change to IP address
  port: 3000,
});

conn.setEncoding('utf8'); // interpret data as text
stdin.setEncoding('utf8'); // interpret data as text

conn.on('connect', () => {
  //conn.write('Hello from client!');
});

// Handles receiving data
conn.on('data', (data) => {
  if (awaitingFile) {
    fs.writeFile(`saved/${requestedFile}`, data, 'binary', () => {
      console.log(`Received ${requestedFile}!`);
    });
    awaitingFile = false;

    // Server will send a message with just the filename just prior to 
    // sending the actual data
  } else if (requestedFile && (data.trim() == requestedFile)) {
    console.log('Server about to send us the file!');
    awaitingFile = true;
  } else {
    console.log('Server says: ', data);
  }
});

stdin.on('data', (input) => {
  requestedFile = input.trim();
  conn.write(input);
});