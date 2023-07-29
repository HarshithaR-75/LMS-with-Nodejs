const express = require('express');
const mysql = require('mysql'); 

const app = express();
const port = 3000;

// Database connection details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'lms'
});


// Create connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'lms'
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Connection failed:', error);
    return;
  }
  console.log('Connected to the database!');
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Form submission for Admin add page
app.post('/submit1', (req, res) => {
  const { bookidinput, booknameinput, authorinput, publicationinput, branches } = req.body;

  // SQL query to insert data
  const sql1 = `INSERT INTO book_details (Book_no, Book_name, Author, Publication, Branch) 
               VALUES ('${bookidinput}', '${booknameinput}', '${authorinput}', '${publicationinput}', '${branches}')`;

  // Execute the query
  connection.query(sql1, (error, result) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error adding record');
    } else {
      console.log('Record added successfully');
      res.status(200).send('Record added successfully');
    }
  });
});


// Form submission for Admin delete page
app.post('/submit2', (req, res) => {
    const bookIdToDelete = req.body.bookidinput;
  
    // SQL query to delete data
    const sql1 = `DELETE FROM book_details WHERE Book_no = '${bookIdToDelete}'`;
  
    // Execute the query
    connection.query(sql1, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error deleting record');
      } else {
        console.log('Record added successfully');
        res.status(200).send('Record deleted successfully');
      }
    });
  });


  // Form submission for Admin update page
app.post('/submit3', (req, res) => {
    const { bookid, bookname, author, publication } = req.body;
  
 // SQL query to update the data
let sql3 = 'UPDATE book_details SET ';

// Check if each column is specified in the form, and append it to the query if it's present
if (bookname) {
  sql3 += `Book_name = '${bookname}', `;
}
if (author) {
  sql3 += `Author = '${author}', `;
}
if (publication) {
  sql3 += `Publication = '${publication}', `;
}

// Remove the trailing comma and space from the query
sql3 = sql3.slice(0, -2);

// Append the WHERE condition for the specific row to update
sql3 += ` WHERE Book_no = '${bookid}'`;

    // Execute the query
    connection.query(sql3, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error updating record');
      } else {
        console.log('Record updated successfully');
        res.status(200).send('Record updated successfully');
      }
    });
  });


  // Form submission for Admin issue page
app.post('/submit4', (req, res) => {
    const { usn, bookid, issuedate, returndate } = req.body;

  // SQL query to insert the data
  const sql4 = `INSERT INTO borrower (Usn, Book_no, Issue_Date, Return_Date) VALUES ('${usn}', '${bookid}', '${issuedate}', '${returndate}')`;
    // Execute the query
    connection.query(sql4, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error issuing book');
      } else {
        console.log('Book issued successfully');
        res.status(200).send('Book issued successfully');
      }
    });
  });


  // Form submission for Admin return page
app.post('/submit5', (req, res) => {
    const { usn, bookid, returndate } = req.body;

    // SQL query to update the data
    const sql5 = `UPDATE borrower SET Actual_return_date='${returndate}' WHERE Book_no='${bookid}' AND Usn='${usn}'`;
    
    // Execute the query
    connection.query(sql5, (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Error in returning the book');
      } else {
        console.log('Book returned successfully');
        res.status(200).send('Book returned successfully');
      }
    });
  });
  

  // Form submission for Registration Page
app.post('/submit6', (req, res) => {
  const { user,usn,branch, mobile, email,password, conpassword } = req.body;

  // SQL query to insert data
  const sql6 = `INSERT INTO student_details (Usn, S_name, S_branch, M_no , S_email, S_password ) VALUES 
  ('${usn}','${user}','${branch}','${mobile}','${email}','${password}')`;


  // Execute the query
  connection.query(sql6, (error, result) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Error adding record');
    } else {
      console.log('Record added successfully');
      res.redirect("update.html");
    }
  });
});



  // Form submission for Admin Login Page
  app.post('/submit7', (req, res) => {
    const {aemail, apassword } = req.body;
  
    // SQL query 
    const sql7 = `SELECT * FROM admin WHERE A_email = '${aemail}' AND A_password = '${apassword}'`;
    connection.query(sql7, (error, result) => {
      if (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Error querying the database');
      } else {
        // If a matching record is found, the login is successful
        if (result.length === 1) {
          console.log('Login successful!');
          // Redirect to the home page or any other authenticated page
          res.redirect('/update.html');
        } else {
          console.log('Invalid email or password!');
          res.status(401).send('Invalid email or password');
        }
      }
    });
  });

// Form submission for Student Login Page
app.post('/submit8', (req, res) => {
  const {semail, spassword } = req.body;

  // Query the database to check if the username and password are correct
  const sql8 = `SELECT * FROM student_details WHERE S_email = '${semail}' AND S_password = '${spassword}'`;
  connection.query(sql8, (error, result) => {
    if (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Error querying the database');
    } else {
      // If a matching record is found, the login is successful
      if (result.length === 1) {
        console.log('Login successful!');
        // Redirect to the home page or any other authenticated page
        res.redirect('/Student_Dashboard.html');
      } else {
        console.log('Invalid email or password!');
        res.status(401).send('Invalid email or password');
      }
    }
  });
});

// // Define a route to handle the request and generate the HTML table rows
// app.get('/booksissued', (req, res) => {
//   // SQL query to retrieve specific columns from the database
//   const sql = `SELECT borrower.Book_no, book_details.Book_name, book_details.Author, book_details.Publication, borrower.Issue_Date, borrower.Return_Date
//         FROM borrower
//         INNER JOIN book_details ON borrower.Book_no = book_details.Book_no
//         WHERE borrower.Actual_return_date IS NULL and Usn='1BM21CS075';`;

//   // Execute the query
//   pool.query(sql, (err, rows) => {
//     if (err) {
//       console.error('Error executing SQL query: ' + err.stack);
//       return res.status(500).send('Internal Server Error');
//     }

//     // Check if the query returned any rows
//     if (rows.length > 0) {
//       let tableRows = '';

//       // Generate the table rows dynamically
//       rows.forEach((row) => {
//         tableRows += `<tr>`;
//         tableRows += `<td>${row.Book_no}</td>`;
//         tableRows += `<td>${row.Book_name}</td>`;
//         tableRows += `<td>${row.Author}</td>`;
//         tableRows += `<td>${row.Publication}</td>`;
//         tableRows += `<td>${row.Issue_Date}</td>`;
//         tableRows += `<td>${row.Return_Date}</td>`;
//         tableRows += `</tr>`;
//       });

//       // Read the existing HTML file
//       const fs = require('fs');
//       const htmlFile = fs.readFileSync('C:\Users\harsh\OneDrive\Desktop\LMS SEM 4 (with nodejs)\public\booksissued.html', 'utf8');

//       // Inject the table rows into the HTML file
//       const updatedHtmlFile = htmlFile.replace('  <!-- Table rows will be added dynamically with JavaScript -->', tableRows);

//       // Send the updated HTML file as the response
//       res.send(updatedHtmlFile);
//     } else {
//       res.send('No records found');
//     }
//   });
// });


app.get('/booksissued', (req, res) => {
  const sql = `SELECT borrower.Book_no, book_details.Book_name, book_details.Author, book_details.Publication, borrower.Issue_Date, borrower.Return_Date
    FROM borrower
    INNER JOIN book_details ON borrower.Book_no = book_details.Book_no
    WHERE borrower.Actual_return_date IS NULL and Usn='1BM21CS075';`;

  // Execute the query using the connection pool
  pool.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

     // Render the 'booksissued' template and pass the retrieved data to it
     res.render('booksissued', { rows });
  });
});


app.get('/booksreturned', (req, res) => {
  const sql = `SELECT borrower.Book_no, book_details.Book_name, book_details.Author, borrower.Actual_return_date
  FROM borrower
  INNER JOIN book_details ON borrower.Book_no = book_details.Book_no
  WHERE borrower.Actual_return_date IS NOT NULL and Usn='1BM21CS075';`;

  // Execute the query using the connection pool
  pool.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

     // Render the 'booksreturned' template and pass the retrieved data to it
     res.render('booksreturned', { rows });
  });
});


app.get('/booksnotreturned', (req, res) => {
  const sql = `SELECT borrower.Book_no, book_details.Book_name, book_details.Author, book_details.Publication, borrower.Issue_Date, borrower.Return_Date, borrower.Actual_return_date
  FROM borrower
  INNER JOIN book_details ON borrower.Book_no = book_details.Book_no
  WHERE borrower.Actual_return_date IS NULL and Usn='1BM21CS075'  and CURDATE() > borrower.Return_Date;`;

  // Execute the query using the connection pool
  pool.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

     // Render the 'booksnotreturned' template and pass the retrieved data to it
     res.render('booksnotreturned', { rows });
  });
});


// Define a route to handle the request and generate the HTML table rows
app.get('/bookslatefee', (req, res) => {
  const sql = `SELECT borrower.Book_no, book_details.Book_name, borrower.Issue_Date, book_details.Author, borrower.Return_Date, borrower.Actual_return_date,
    DATEDIFF(borrower.Actual_return_date, borrower.Return_Date) AS Days_Late,
    1 * DATEDIFF(borrower.Actual_return_date, borrower.Return_Date) AS Late_Fee
    FROM borrower
    INNER JOIN book_details ON borrower.Book_no = book_details.Book_no
    WHERE borrower.Actual_return_date > borrower.Return_Date AND Usn='1BM21CS075';`;

  // Execute the query
  pool.query(sql, (err, rows) => {
    if (err) {
      console.error('Error executing SQL query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Check if the query returned any rows
    if (rows.length > 0) {
      res.render('bookslatefee', { rows });
    } else {
      res.send('No late books found');
    }
  });
});
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
