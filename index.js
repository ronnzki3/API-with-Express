const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql');
var cors = require('cors');
const moment = require('moment');
// const { connect } = require('http2');

const PORT = process.env.PORT || 5000 ;


const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'employee'
});

connection.connect();


const logger = (req, res, next ) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format()}`);
    next();
}

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.get('/api/members',(req, res)=>{    
    connection.query('SELECT * FROM userdata',(err, rows, fields)=>{
        if(err) throw err
        res.json(rows);
    });
});


//display individual member
app.get('/api/members/:id',(req, res)=>{    

    var id = req.params.id;

    connection.query(`SELECT * FROM userdata WHERE id='${id}'`,(err, rows, fields)=>{
        if(err) throw err

        if(rows.length > 0){
            res.json(rows);
        }else{
            res.status(400).json({msg: `No user found with an id of ${id}`});
        }
        
    });
});



//add new member
app.post('/api/members',(req, res)=>{   
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var gender = req.body.gender;

    connection.query(`INSERT INTO userdata (first_name,last_name,email,gender) VALUES ('${fname}','${lname}','${email}','${gender}') `,(err, rows, fields)=>{
        if(err) throw err
        res.json({msg: `New user successfully added.`});        
    });
});


//update member
app.put('/api/members',(req, res)=>{   
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var gender = req.body.gender;
    var id = req.body.id;

    connection.query(`UPDATE userdata SET first_name='${fname}', last_name='${lname}', email='${email}', gender='${gender}' WHERE id='${id}'`,(err, rows, fields)=>{
        if(err) throw err
        res.json({msg: `user successfully updated.`});        
    });
});



//delete member
app.delete('/api/members',(req, res)=>{   
   
    var id = req.body.id;

    connection.query(`DELETE FROM userdata WHERE id='${id}'`,(err, rows, fields)=>{
        if(err) throw err
        res.json({msg: `user successfully deleted.`});        
    });
});




app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT, ()=>{
    console.log(`Server is started in port ${PORT}`);
});