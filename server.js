
const express = require('express');
const http = require('http');
const socket = require('socket.io')
const cors = require('cors')
const mysql = require('mysql2')

const config = { host: 'localhost', user: 'haseeb', password: 'Has33b!123$', database: 'QUIZ_SYSTEM' }
const connection = mysql.createConnection(config);


const corseOption = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ["CONTENT-TYPE"]
}






function RegisterUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    connection.query(`insert into STUDENT(username,password,email) VALUES('${username}','${password}','${email}')`, function (err, rows) {
        if (err) {

            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                res.status(201).send({ "status": 'failed', "message": err.message, "error": "DUPLICATE_USER" })
            }
            else {
                res.status(203).send({ "status": 'failed', "message": err.message, "error": "QUERY_ERROR" })

            }

        } else {
            res.status(200).send({ "status": 'success', "data": rows })

        }
    })
}






const app = express()
app.use(cors(corseOption))
app.use(express.json())
const server=http.createServer(app);

const io=socket(server, {
    cors: { origin: '*' }
});



// message Broadcasting 
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('leave', (chat) => {
        socket.leave(chat);
        console.log(`Socket ${socket.id} left room ${chat}`);
      });
    socket.on('join', (chat) => {
        console.log( "Joined : ",chat);
        socket.join(chat)
    });
    socket.on('message', (data) => {
        console.log(data.message);
        io.to(data.room).emit('message',data. message);
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });
    io.on("connection", socket => {
        console.log("Socket ::::", socket.id)
    })
    


  
});












connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed : ", err);


    } else {
        console.log("Database Connected Successfully!")
    }
})


async function getQuizCourses(req, res) {
    console.log("Get api request for courses from : ", req.ip)
    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query("SELECT * FROM COURSE", (err, result, feilds) => {
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


async function getQuizTopics(req, res) {
    console.log(`Get api request for Topics with course_id : ${req.params.course_id}`, req.ip)
    const course_id = req.params.course_id;
    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query(`SELECT * FROM TOPIC WHERE course_id=${course_id}`, (err, result, feilds) => {
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

async function getQuizes(req, res) {
    const course_id = req.params.course_id;
    const topic_id = req.params.topic_id;
    console.log(`Get api request for Quizes with course_id : ${course_id} topic_id : ${topic_id} from : `, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {

            connection.query(`SELECT * FROM QUIZ WHERE course_id=${course_id} AND topic_id=${topic_id}`, (err, result, feilds) => {
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

async function getQuestions(req, res) {
    const quiz_id = req.params.quiz_id;
    console.log(`Get api request for Questions with quiz_id : ${quiz_id} from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
            console.log(err.message)
        }
        else {
            connection.query(`SELECT * FROM QUESTION WHERE quiz_id=${quiz_id} `, (err, result, feilds) => {
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

async function saveResult(req, res) {

    const results = req.body
    const quiz_id = req.params.quiz_id;
    console.log(`Post api request for Result from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query("Insert into RESULT (quiz_id,question_id,student_id, selected_option,correct_answer) VALUES ? "
                , [results.map(result => [result.quiz_id, result.question_id, result.student_id, result.selected_option, result.correct_answer])], (err, result, fields) => {
                    if (err) {
                        console.log("Query Error : ", err)
                        res.status(500).send({ "message": "Query Error : ", err })
                    }
                    else {
                        console.log('Result : ', result)
                        res.status(200).send({ "result": result, "message": 'Result record saved succesfully' })

                    }
                })

        }
    })
}



async function getAttemptedQuiz(req, res) {
    const student_id = req.params.student_id;
    console.log(`Get api Quiz Count for student_id : ${student_id} from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query(`select *   from QUIZ where quiz_id in (select DISTINCT quiz_id from RESULT Where student_id=${student_id}) `, (err, result, feilds) => {
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


function getQuizCount(req, res) {
    const course_id = req.params.course_id;
    console.log(`Get api Quiz Count for course_id : ${course_id} from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query(`select count(course_id) as quiz_count ,course_id from QUIZ where course_id=${course_id}`, (err, result, feilds) => {
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

function getQuizResult(req, res) {
    const quiz_id = req.params.quiz_id;
    const student_id = req.params.student_id;

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query(`SELECT * FROM QUESTION INNER JOIN RESULT ON QUESTION.question_id=RESULT.question_id and student_id=${student_id} and RESULT.quiz_id=${quiz_id}`, (err, result, feilds) => {
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
function LoginUser(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    connection.query(`select * from STUDENT where email='${email}' AND password='${password}'`, function (err, rows) {
        if (err) {


            res.status(203).send({ "status": 'failed', "message": err.message, "error": "QUERY_ERROR" })



        } else {
            res.status(200).send({ "status": 'success', "data": rows })

        }
    })
}


async function getLeaderboardData(req, res) {
    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
        }
        else {
            connection.query("SELECT * FROM POSITION ORDER BY  total_correct_answers DESC,  total_quizzes_attempted DESC,  total_questions_attempted DESC ", (err, result, feilds) => {
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



async function AddDisputedQuestion(req,res){
    const data=req.body;
    const question_id=data.question_id;
    const highlighted_by=data.highlighted_by;
    const claimed_answer=data.claimed_answer;
    const statement=data.statement;

    connection.query(`insert into DISPUTED_QUESTION(question_id,highlighted_by,claimed_answer,statement)
     VALUES(${question_id},'${highlighted_by}','${claimed_answer}','${statement}')`,
      function (err, rows) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
            console.log("DUPLICATE ROW : ",err )












                res.status(201).send({ "status": 'failed', "message": err.message, "error": "DUPLICATE_USER","err":rows })
            }
            else {
                res.status(203).send({ "status": 'failed', "message": err.message, "error": "QUERY_ERROR" })

            }

        } else {
            res.status(200).send({ "status": 'success', "data": rows })

        }
    })
}




async function AddMessage(req,res){
    const data=req.body;
    const dispute_id=data.dispute_id;
    const question_id=data.question_id;
    const message=data.message;
    message.replace("\'",'"');
    const sender=data.sender;

    connection.query(`insert into MESSAGE(dispute_id,question_id,sender,message)
     VALUES(${dispute_id},${question_id},'${sender}','${message}')`,
      function (err, rows) {
        if (err) {

            if (err.code == 'ER_DUP_ENTRY' || err.errno == 1062) {
                const duplicateDisputeId = rows[0].dispute_id;
                console.log("Duplicate id --> ",duplicateDisputeId)
                res.status(201).send({ "status": 'failed', "message": err.message, "error": "DUPLICATE_USER" ,"Duplicate":1})
            }
            else {
                res.status(203).send({ "status": 'failed', "message": err.message, "error": "QUERY_ERROR" })

            }

        } else {
            console.log("result Messgae save :",rows)
            
            res.status(200).send({ "status": 'success', "data": rows })
           

        }
    })
}




async function getDisputed_Questions(req,res){

    connection.query(
        `
        
        SELECT
          q.question_id, q.question, q.alpha, q.beta, q.charlie, q.delta, q.correct_answer,
          d.dispute_id, d.claimed_answer, d.statement, d.highlighted_by, d.sharing_time
        FROM
          QUESTION q, DISPUTED_QUESTION d
        WHERE
          q.question_id = d.question_id
        ORDER BY
          d.sharing_time DESC;
        `,
     function (err, rows) {
       if (err) {

          
               res.status(203).send({ "status": 'failed', "message": err.message, "error": "QUERY_ERROR" })

           

       } else {
           res.status(200).send(rows )

       }
   })




}




async function getDisputeMessages(req, res) {
    const question_id = req.params.question_id;
    console.log(`Get api request for MESSAGE with question_id : ${question_id} from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
            console.log(err.message)
        }
        else {
            connection.query(`SELECT * FROM MESSAGE WHERE question_id=${question_id} `, (err, result, feilds) => {
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





async function fetchJson(req, res) {
    const table_name = req.params.table_name;
    console.log(`Get api request for all data  form table  : ${table_name} from : =>`, req.ip)

    connection.connect((err) => {
        if (err) {
            console.log("Connection Error : ", err)
            res.status(500).send({ "message": err.message })
            console.log(err.message)
        }
        else {
            connection.query(`SELECT * FROM ${table_name} `, (err, result, feilds) => {
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


























// ____________________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________________












//Get Routes 

app.get("/quiz_data/courses", getQuizCourses)
app.get("/quiz_data/topics/:course_id", getQuizTopics)
app.get("/quiz_data/quizes/:course_id/:topic_id", getQuizes)
app.get("/quiz_data/questions/:quiz_id", getQuestions)
app.get("/quiz_data/attempted_quiz_count/:student_id", getAttemptedQuiz)
app.get("/quiz_data/quiz_count/:course_id", getQuizCount)
app.get("/quiz_data/get_result/:quiz_id/student/:student_id", getQuizResult)
app.get("/quiz_data/positions", getLeaderboardData)
app.get("/quiz_data/get_disputed_question_list", getDisputed_Questions)
app.get("/quiz_data/messages/:question_id", getDisputeMessages)



// var count =0
// app.get("/test",async(req,res)=>{
    
//     if(count>10000){
//         res.status(505).send({"msg":"error crashed"})
//     }else{
//         res.status(200).send({"msg":"Ok -> "+count})
//     }
// })




//Post Routes  

app.post("/quiz_data/save_result", saveResult)
app.post("/user/register", RegisterUser)
app.post("/user/login", LoginUser)
app.post("/quiz_data/add_disputed_question", AddDisputedQuestion)
app.post("/quiz_data/addMessage", AddMessage)



//export jsons data 

app.get('/quiz_data/records/:table_name',fetchJson);










server.listen(5000, () => {
    console.log("Server is listening at port 5000")
})
