const mysql = require('mysql');
const express = require('express');

const app = express();


// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',      // MySQL database host (e.g., 'localhost')
  user: 'root',  // MySQL database user
  password: 'root123',  // MySQL database password
  database: 'lms'   // MySQL database name
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database: ', error);
    return;
  }
  console.log('Connected to the database!');
  
  // Perform a query
  connection.query('SELECT * FROM book_details', (error, results) => {
    if (error) {
      console.error('Error executing query: ', error);
      return;
    }
    
    // Process the results
    console.log('Query results: ', results);
    
    // Close the connection
    connection.end((error) => {
      if (error) {
        console.error('Error closing connection: ', error);
        return;
      }
      console.log('Connection closed.');
    });
  });
});
