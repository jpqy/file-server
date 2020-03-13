const net = require('net');
const stdin = process.stdin; // Handles input for requesting
const fs = require('fs');
const EOF = 'THEFILEHASENDED';

let requestedFile; // Stores filename being requested
let awaitingFile = false; // Stores whether server is about to send the file
let transferring = false;
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
  //console.log('data ',data);
  //console.log('eof ', EOF);

  // Initial buffer, write file
  if (awaitingFile) {
    fs.writeFileSync(`saved/${requestedFile}`, data, 'binary', () => {
      console.log(`Receiving ${requestedFile}...`);
    });
    awaitingFile = false;
    transferring = true;
  } else if (data.trim() == EOF.trim()) {
    // Encountered the EOF marker
    transferring = false;
    console.log(`Received ${requestedFile}!`);
  } else if (transferring) {
    // Transfer in progress, append file
    fs.appendFileSync(`saved/${requestedFile}`, data, 'binary', () => {
      console.log(`Still receiving ${requestedFile}...`);
    });

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