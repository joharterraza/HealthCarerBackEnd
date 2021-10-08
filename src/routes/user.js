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
                    jwt.sign({userIdToken}, 'secretkey', {expiresIn: 3600}, (err,token) =>{
                        
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

//get schedule
router.get('/user/:id/schedule', ensureToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            const {id} = req.params;
    
            if(isEmpty(id)){
                res.json({Status : 900, message: 'Missing parameters'})
            }
            else{
                const query = `  select s.id as idSchedule, s.startingOn, s.takenDate, s.nextDosisDate, s.takenDosis, s.status, s.Dosage, s.takeEvery, s.totalDosis, s.notes,
                m.id as idMedication, m.brandName, m.info
                from schedule as s
                join medication as m on s.medication = m.id
                where user = ?;`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            res.json({Status: 1, message: 'User ID is invalid'})
                        }
                        else{
                            
                            var scheduleArray = []
                            var medicationObject = {}
                            rows.forEach(r => {
                                medicationObject = {
                                    genericName: r.idMedication,
                                    brandName: r.brandName,
                                    info: r.info
                                }
                                scheduleArray.push({
                                    id: r.idSchedule,
                                    startingOn: r.startingOn,
                                    lastDoseDate: r.takenDate,
                                    nextDoseDate: r.nextDosisDate,
                                    takenDosis: r.takenDosis,
                                    status: r.status,
                                    dosage: r.Dosage,
                                    takeEvery: r.takeEvery,
                                    totalDosis: r.totalDosis,
                                    medication: medicationObject
        
                                })
                            });
                            scheduleJson = {Status: 0, schedule: scheduleArray}
                            res.json(scheduleJson)
                                                  
                           
                            
                            
                        }
                        
                       
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
        }
    })
    
})

//get user by id
router.get('/user/:id/', ensureToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            const {id} = req.params;
    
            if(isEmpty(id)){
                res.json({Status : 900, message: 'Missing parameters'})
            }
            else{
                const query = `  select u.id,u.email, u.photo, u.name, u.lastName, u.phoneNumber, u.token as pairingToken, 
                u.genre, u.dateOfBirth, u.healtCarer, l.latitude, l.longitude 
                from user as u
                left join location as l on u.currentLocation = l.id
                where u.id = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            res.json({Status: 1, message: 'User ID is invalid'})
                        }
                        else{
                            
                            var userArray = {}
                            var locationObject = {}
                            rows.forEach(r => {
                                if(r.latitude == null && r.longitude == null){
                                    locationObject = null
                                }
                                else{
                                    locationObject = {
                                        latitude: r.latitude,
                                        longitude: r.longitude,
                                        
                                    }
                                }
                                
                                userArray = {
                                    id: r.id,
                                    email: r.email,
                                    photo: r.photo,
                                    name: r.name,
                                    lastName: r.lastName,
                                    phoneNumber: r.phoneNumber,
                                    pairingToken: r.pairingToken,
                                    gender: r.genre,
                                    dob: r.dateOfBirth,
                                    carer: r.healtCarer,
                                    currentLocation: locationObject
                                }
                            });
                            userJson = {Status: 0, user: userArray}
                            res.json(userJson)
                                                  
                           
                            
                            
                        }
                        
                       
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
        }
    })
    
})

//get prescription by id
router.get('/user/:id/schedule/:idPresc', ensureToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            const {id, idPresc} = req.params;
    
            if(isEmpty(id)){
                res.json({Status : 900, message: 'Missing parameters'})
            }
            else{
                const query = `  select s.id as idSchedule, s.startingOn, s.takenDate, s.nextDosisDate, s.takenDosis, s.status, s.Dosage, s.takeEvery, s.totalDosis, s.notes,
                m.id as idMedication, m.brandName, m.info
                from schedule as s
                join medication as m on s.medication = m.id
                where user = ? and s.id = ?;`
                mysqlConnection.query(query, [id, idPresc], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            res.json({Status: 1, message: 'User ID or Prescription ID is invalid'})
                        }
                        else{
                            
                            var prescArray = {}
                            var medicationObject = {}
                            rows.forEach(r => {
                                medicationObject = {
                                    genericName: r.idMedication,
                                    brandName: r.brandName,
                                    info: r.info
                                }
                                prescArray = {
                                    id: r.idSchedule,
                                    startingOn: r.startingOn,
                                    lastDoseDate: r.takenDate,
                                    nextDoseDate: r.nextDosisDate,
                                    takenDosis: r.takenDosis,
                                    status: r.status,
                                    dosage: r.Dosage,
                                    takeEvery: r.takeEvery,
                                    totalDosis: r.totalDosis,
                                    medication: medicationObject
                                }
                            });
                            prescJson = {Status: 0, prescription: prescArray}
                            res.json(prescJson)
                                                  
                           
                            
                            
                        }
                        
                       
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
        }
    })
    
})

//get carer
router.get('/user/:id/carer', ensureToken, (req,res) => {
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            const {id} = req.params;
    
            if(isEmpty(id)){
                res.json({Status : 900, message: 'Missing parameters'})
            }
            else{
                const query = `  select h.id, h.email, h.photo, h.name, h.lastName, h.phoneNumber,  
                h.genre, h.dateOfBirth 
                from healthcarer as h
                join user as u on u.healtCarer = h.id
                where u.id = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                                     
                        if(rows.length == 0){
                            
                            res.json({Status: 1, message: 'No Carer asigned'})
                        }
                        else{
                            
                            var carerObject = {}
                           
                            rows.forEach(r => {
                                carerObject = {
                                    id: r.id,
                                    email: r.email,
                                    photo: r.photo,
                                    name: r.name,
                                    lastName: r.lastName,
                                    phoneNumber: r.phoneNumber,
                                    pairingToken: r.pairingToken,
                                    gender: r.genre,
                                    dob: r.dateOfBirth
                                    
                                }
                                
                                
                            });
                            carerJson = {Status: 0, carer: carerObject}
                            res.json(carerJson)
                                                  
                           
                            
                            
                        }
                        
                       
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
        }
    })
    
})






router.get('/verify/user', ensureToken, (req, res) => {
   
    
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
    if(err){
        res.json({Status: 2, message: "Invalid Token"})
      
    }else{
      res.json(verifiedJwt)
    }
  })
})

//check token aviability
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