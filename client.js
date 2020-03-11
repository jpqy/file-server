const net = require('net');
const stdin = process.stdin; // Handles input for requesting

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
  console.log('Server says: ', data);
});

stdin.on('data', (input) => {
  //console.log("Requested: ", input);
  conn.write(input);
})