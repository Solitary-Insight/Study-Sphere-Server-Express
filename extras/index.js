

// const app = require('express')();
// const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer, {
//     cors: { origin: '*' }
// });

// const port = 7000;

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('message', (message) => {
//         console.log(message);
//         io.emit('message', message);
//     });

//     socket.on('disconnect', () => {
//         console.log('a user disconnected!');
//     });
//     io.on("connection", socket => {
//         console.log("Socket ::::", socket.id)
//     })
    


//     app.get("/", (req, res) => {
//         res.send("Hello from server")
//     })
// });

// httpServer.listen(port, () => console.log(`listening on port ${port}`));



const fs = require('fs');
const mysql = require('mysql2');

// MySQL connection configuration
const config = {
  host: 'mysql-e0e2302-abdulhaseeb12036-5843.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_Z3yTv4rlYfc-iwGnmF6',
  database: 'defaultdb',
  port: 27775
};

// Read the SQL file
const sqlFile = '/home/solitary-insight/Desktop/DBMS project/QUIZ_SYSTEM_DATABASE.sql';
const sqlQueries = fs.readFileSync(sqlFile, 'utf-8');

// Create a MySQL connection
const connection = mysql.createConnection(config);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
});
function getQuizResult( ) {
   

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query(`SELECT * FROM QUESTION INNER JOIN RESULT ON QUESTION.question_id=RESULT.question_id`, (err, result, feilds) => {
                if (err) {
                    console.log("Query Failed : ", err)
                    res.status(500).send({ "message": err.message })

                } else {
                    res.status(200).send(result)
                }
            })
        }
    })
}


getQuizResult()