const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');
const jwt = require('jsonwebtoken');

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
//ADD carer
router.post('/carer/add', (req, res) => {
    dataAddCarer = req.body;
    // const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
    if(isEmpty(dataAddCarer.email) || isEmpty(dataAddCarer.password) || isEmpty(dataAddCarer.photo) || isEmpty(dataAddCarer.name) ||        
    isEmpty(dataAddCarer.lastname) || isEmpty(dataAddCarer.phonenumber)  || isEmpty(dataAddCarer.dob) || isEmpty(dataAddCarer.genre)){

        res.json({Status : 900, mensaje: 'Missing parameters'})
    }    
    else{
        const query = `insert into healthcarer (email, password, photo, name, lastName, 
            phoneNumber, dateOfBirth, genre) values(?,(sha1(?)),?,?,?,?,?,?)`;
        // console.log(dataAddCarer.email)
        // console.log(dataAddCarer.password)
        // console.log(dataAddCarer.photo)
        // console.log(dataAddCarer.name)
        // console.log(dataAddCarer.lastname)
        // console.log(dataAddCarer.phonenumber)
        // console.log(dataAddCarer.email)
        // console.log(dataAddCarer.dob)
        mysqlConnection.query(query, [dataAddCarer.email, dataAddCarer.password, dataAddCarer.photo,
            dataAddCarer.name, dataAddCarer.lastname, dataAddCarer.phonenumber, dataAddCarer.dob, dataAddCarer.genre], 
            (err, rows, fields) => {
                
                if(!err) {
                    console.log(rows);
                    if(rows.affectedRows > 0){
                        res.json({Status : 0, mensaje: 'Health Carer added successfuly'})        
                    }
                    else{
                        res.json({Status : 1, mensaje: 'Could not add carer'})
                    } 
                }else {
                    console.log(err)
                    res.json({Status : 1, mensaje: 'Could not add carer'})
                }
        });
    }
    
  
});

router.get('/carer/login/', (req,res) => {
    dataLogin = req.headers;
    
    if(isEmpty(dataLogin.email) && isEmpty(dataLogin.password)){
        res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `  select id,email, photo, name, lastName, phoneNumber,  
        genre, dateOfBirth from healthcarer where email = ? and password = sha1(?);`
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
                    jwt.sign({userIdToken}, 'secretkeycarer', {expiresIn: 60}, (err,token) =>{
                        
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

router.get('/verify/carer', ensureToken, (req, res) => {
   
    
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