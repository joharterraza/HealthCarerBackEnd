const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');
const jwt = require('jsonwebtoken');



function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}


//ADD users
router.post('/user/add', (req, res) => {
    dataAddUser = req.body;
    console.log(dataAddUser)
    // const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
    if(isEmpty(dataAddUser.email) || isEmpty(dataAddUser.password) || isEmpty(dataAddUser.photo) || isEmpty(dataAddUser.name) ||        
        isEmpty(dataAddUser.lastname) || isEmpty(dataAddUser.phonenumber) || isEmpty(dataAddUser.genre) ||
        isEmpty(dataAddUser.dob)){

      res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
        // console.log(headers.email)
        // console.log(headers.password)
        // console.log(headers.photo)
        // console.log(headers.name)
        // console.log(headers.lastname)
        // console.log(headers.phonenumber)
        // console.log(headers.genre)
        //console.log(headers.dob)
        mysqlConnection.query(query, [dataAddUser.email, dataAddUser.password, dataAddUser.photo,
            dataAddUser.name, dataAddUser.lastname, dataAddUser.phonenumber, dataAddUser.genre,
            dataAddUser.dob], (err, rows, fields) => {
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

// //function that returns schedule from user
// function getSchedule(idUser, next){    
//     var result = []
//     const query = `  select * from medicines_treatments_schedule where user = ?;`
//     mysqlConnection.query(query, [idUser], (err, rows, fields) => {
//         if(!err) {
            
//             for(var i = 0; i < rows.length; i++){
//                 obj = JSON.parse(JSON.stringify(rows[i]))   
//                 result.push(obj)               
//             }    
//             next(null,result);         
//         }else {
//             console.log(err);
//             next(error)
//         }
        
//     })
    
   
    
    
// }

//Get user by token
// router.get('/user/byToken/', (req,res) => {
//     headers = req.headers;
//     const token = headers.token;
//     if(isEmpty(token)){
//         res.json({Status : 900, message: 'Missing parameters'})
//     }
//     else{
//         const query = `  select id,username, photo, name, lastName, currentLat, currentLong, phoneNumber, 
//         genre, dateOfBirth from user where token = ?;`
//         mysqlConnection.query(query, [token], (err, rows, fields) => {
//             if(!err) {
//                 console.log(rows);                
//                 if(rows.length == 0){
                    
//                     res.json({Status: 1, message: 'Could not find user'})
//                 }
//                 else{
//                     user = JSON.parse(JSON.stringify(rows[0]))   
//                     // schedule = JSON.parse(getSchedule(user.id)) 
//                     userJson = {Status: 0, user : rows[0], schedule: []}                      
//                     console.log(user.id)
//                     getSchedule(user.id, function(err, data) {
//                         if(err) {
//                            // handle the error
//                         } else {
//                            // handle your data
//                             for(var i= 0; i< data.length; i++){
//                                 userJson.schedule.push(data[i])
//                             }  
//                             res.json(userJson)
//                         }
//                     });    
                    
//                 }
                
               
//             }else {
//                 console.log(err);
//             }
//         });
//     }
// })

//Login
router.get('/user/login/', (req,res) => {
    dataLogin = req.headers;
    
    if(isEmpty(dataLogin.email) && isEmpty(dataLogin.password)){
        res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `  select id,email, photo, name, lastName, phoneNumber, token as pairingToken, 
        genre, dateOfBirth, healtCarer from user where email = ? and password = sha1(?);`
        mysqlConnection.query(query, [dataLogin.email, dataLogin.password], (err, rows, fields) => {
            if(!err) {
                console.log(rows);                
                if(rows.length == 0){
                    
                    res.json({Status: 1, message: 'Email or password incorrect'})
                }
                else{
                    user = JSON.parse(JSON.stringify(rows[0]))  
                    userIdToken = user.id 
                    // schedule = JSON.parse(getSchedule(user.id)) 
                    jwt.sign({userIdToken}, 'secretkey', {expiresIn: 60}, (err,token) =>{
                        
                        userJson = {Status: 0, token: token, user : rows[0]}
                        res.json(userJson)
                    })
                                          
                   
                    
                    
                }
                
               
            }else {
                console.log(err)
                res.json({Status : 500, message: 'Internal server error'})
            }
        });
    }
})

router.get('/verify/user', ensureToken, (req, res) => {
   
    
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
    if(err){
        res.json({Status: 2, message: "Invalid Token"})
      
    }else{
      res.json(verifiedJwt)
    }
  })
})

function ensureToken(req,res,next){
    const bearerHeader = req.headers["authorization"]
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next();
    }
    else{
        res.json({Status: 2, message: "Invalid Token"})
    }
}







module.exports = router;