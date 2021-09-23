const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');


function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}


//ADD users
router.post('/user/add', (req, res) => {
    headers = req.headers;
    // const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
    if(isEmpty(headers.username) || isEmpty(headers.password) || isEmpty(headers.photo) || isEmpty(headers.name) ||        
        isEmpty(headers.lastname) || isEmpty(headers.phonenumber) || isEmpty(headers.genre) ||
        isEmpty(headers.dob)){

      res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
        // console.log(headers.username)
        // console.log(headers.password)
        // console.log(headers.photo)
        // console.log(headers.name)
        // console.log(headers.lastname)
        // console.log(headers.phonenumber)
        // console.log(headers.genre)
        console.log(headers.dob)
        mysqlConnection.query(query, [headers.username, headers.password, headers.photo,
            headers.name, headers.lastname, headers.phonenumber, headers.genre,
            headers.dob], (err, rows, fields) => {
            if(!err) {
                console.log(rows);
                if(rows.affectedRows > 0){
                    res.json({Status : 0, message: 'User added'})        
                }
                else{
                    res.json({Status : 1, message: 'Could not add user'})
                } 
            }else {
                res.json({Status : 1, message: 'Could not add user'})
            }
        });
    }
    
  
});

//function that returns schedule from user
function getSchedule(idUser, next){    
    var result = []
    const query = `  select * from medicines_treatments_schedule where user = ?;`
    mysqlConnection.query(query, [idUser], (err, rows, fields) => {
        if(!err) {
            
            for(var i = 0; i < rows.length; i++){
                obj = JSON.parse(JSON.stringify(rows[i]))   
                result.push(obj)               
            }    
            next(null,result);         
        }else {
            console.log(err);
            next(error)
        }
        
    })
    
   
    
    
}

//Get user by token
router.get('/user/byToken/', (req,res) => {
    headers = req.headers;
    const token = headers.token;
    if(isEmpty(token)){
        res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `  select id,username, photo, name, lastName, currentLat, currentLong, phoneNumber, 
        genre, dateOfBirth from user where token = ?;`
        mysqlConnection.query(query, [token], (err, rows, fields) => {
            if(!err) {
                console.log(rows);                
                if(rows.length == 0){
                    
                    res.json({Status: 1, message: 'Could not find user'})
                }
                else{
                    user = JSON.parse(JSON.stringify(rows[0]))   
                    // schedule = JSON.parse(getSchedule(user.id)) 
                    userJson = {Status: 0, user : rows[0], schedule: []}                      
                    console.log(user.id)
                    getSchedule(user.id, function(err, data) {
                        if(err) {
                           // handle the error
                        } else {
                           // handle your data
                            for(var i= 0; i< data.length; i++){
                                userJson.schedule.push(data[i])
                            }  
                            res.json(userJson)
                        }
                    });    
                    
                }
                
               
            }else {
                console.log(err);
            }
        });
    }
})



module.exports = router;