const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');
const jwt = require('jsonwebtoken');



function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}


//ADD users
router.post('/user/', (req, res) => {
    dataAddUser = req.body;
    console.log(dataAddUser)    
    // const query = `CALL addUser(?,?,?,?,?,?,?,?);`;
    if(isEmpty(dataAddUser.email) || isEmpty(dataAddUser.password) || isEmpty(dataAddUser.photo) || isEmpty(dataAddUser.name) ||        
        isEmpty(dataAddUser.lastname) || isEmpty(dataAddUser.phonenumber) || isEmpty(dataAddUser.genre) ||
        isEmpty(dataAddUser.dob) || isEmpty(dataAddUser.lat) || isEmpty(dataAddUser.long)){

      res.json({Status : 900, message: 'Missing parameters'})
    }
    else{
        const query = `CALL addUser(?,?,?,?,?,?,?,?,?,?);`;
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
            dataAddUser.dob, dataAddUser.lat, dataAddUser.long], (err, rows, fields) => {
            if(!err) {
                console.log(rows);
                if(rows.affectedRows > 0){
                    res.json({Status : 0, message: 'User added'})        
                }
                else{
                    res.json({Status : 1, message: 'Could not add user'})
                } 
            }else {
                console.log(err)
                res.json({Status : 1, message: 'Could not add user'})
            }
        });
    }
    
  
});

//Login
router.get('/user/login/', (req,res) => {
    dataLogin = req.headers;
    
    if(isEmpty(dataLogin.email) || isEmpty(dataLogin.password)){
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
                    jwt.sign({userIdToken}, 'secretkey', {expiresIn: 28800}, (err,token) =>{
                        
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
    var token = req.token;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = `   select s.id as idSchedule, s.startingOn, s.takenDate, s.nextDosisDate, s.takenDosis, s.status, s.Dosage, s.takeEvery, s.totalDosis, s.notes,
                s.medication from schedule as s                
                where user = ? and (s.takenDosis < s.totalDosis);`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        var scheduleArray = []
                        var medicationObject = {}
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            scheduleJson = {Status: 0, schedule: scheduleArray}
                            res.json(scheduleJson);
                        }
                        else{                   
                            rows.forEach(r => {
                                medicationObject = {
                                    name: r.medication
                                }
                                dateS = new Date(r.startingOn);
                                console.log(r.startingOn)
                                start = dateS.getFullYear()+'-' + (dateS.getMonth()+1) + '-'+dateS.getDate()+ ' '+ dateS.toLocaleTimeString('en-US');
                                if(r.takenDate == null){
                                    taken = null
                                    next = null
                                }
                                else{
                                    dateT = new Date(r.takenDate);
                                    taken = dateT.getFullYear()+'-' + (dateT.getMonth()+1) + '-'+dateT.getDate()+ ' '+ dateT.toLocaleTimeString('en-US');
                                    dateN = new Date(r.nextDosisDate);
                                    next = dateN.getFullYear()+'-' + (dateN.getMonth()+1) + '-'+dateN.getDate()+ ' '+ dateN.toLocaleTimeString('en-US');
                                }
                                scheduleArray.push({
                                    id: r.idSchedule,
                                    startingOn: start,
                                    lastDoseDate: taken,
                                    nextDoseDate: next,
                                    takenDosis: r.takenDosis,
                                    status: r.status,
                                    dosage: r.Dosage,
                                    takeEvery: r.takeEvery,
                                    totalDosis: r.totalDosis,
                                    notes: r.notes,
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
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
    
})

//get user by id
router.get('/user/:id/', ensureToken, (req,res) => {
    var token = req.token;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = `   select u.id,u.email, u.photo, u.name, u.lastName, u.phoneNumber, u.token as pairingToken, 
                u.genre, u.dateOfBirth, u.healtCarer, l.latitude, l.longitude 
                from user as u
                left join location as l on u.currentLocation = l.id
                where u.id = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                
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
                        
                    
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
    
})

//get prescription by id
router.get('/user/:id/schedule/:idPresc', ensureToken, (req,res) => {
    var token = req.token;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken

            var idPresc = req.params.idPresc
            if(returnedId.toString() == id){
                const query = `  select s.id as idSchedule, s.startingOn, s.takenDate, s.nextDosisDate, s.takenDosis, s.status, s.Dosage, s.takeEvery, s.totalDosis, s.notes,
                s.medication from schedule as s                
                where user = ? and s.id = ?;`
                mysqlConnection.query(query, [id, idPresc], (err, rows, fields) => {
                    if(!err) {
                        var prescObject = {}
                        var medicationObject = {}
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            res.json({Status: 0, prescription: prescObject})
                        }
                        else{                   
                            rows.forEach(r => {
                                medicationObject = {
                                    name: r.medication
                                }
                                dateS = new Date(r.startingOn);
                                start = dateS.getFullYear()+'-' + (dateS.getMonth()+1) + '-'+dateS.getDate()+ ' '+ dateS.toLocaleTimeString('en-US');
                                if(r.takenDate == null){
                                    taken = null
                                    next = null
                                }
                                else{
                                    dateT = new Date(r.takenDate);
                                    taken = dateT.getFullYear()+'-' + (dateT.getMonth()+1) + '-'+dateT.getDate()+ ' '+ dateT.toLocaleTimeString('en-US');
                                    dateN = new Date(r.nextDosisDate);
                                    next = dateN.getFullYear()+'-' + (dateN.getMonth()+1) + '-'+dateN.getDate()+ ' '+ dateN.toLocaleTimeString('en-US');
                                }
                                prescObject = {
                                    id: r.idSchedule,
                                    startingOn: start,
                                    lastDoseDate: taken,
                                    nextDoseDate: next,
                                    takenDosis: r.takenDosis,
                                    status: r.status,
                                    dosage: r.Dosage,
                                    takeEvery: r.takeEvery,
                                    totalDosis: r.totalDosis,
                                    notes: r.notes,
                                    medication: medicationObject
                                }
                            });
                            prescJson = {Status: 0, prescription: prescObject}
                            res.json(prescJson)
                                                
                        
                            
                            
                        }
                        
                    
                    }else {
                        console.log(err)
                        res.json({Status : 500, message: 'Internal server error'})
                    }
                });
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
    
})

//get carer
router.get('/user/:id/carer', ensureToken, (req,res) => {
    
    var token = req.token;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = `  select h.id, h.email, h.photo, h.name, h.lastName, h.phoneNumber,  
                h.genre, h.dateOfBirth 
                from healthcarer as h
                join user as u on u.healtCarer = h.id
                where u.id = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        var carerObject = {}
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            res.json({Status: 0, carer: carerObject})
                        }
                        else{                   
                            
                       
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
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
    
})

//update user location
router.put('/user/:id/location', ensureToken, (req,res) => {
    var token = req.token;
    dataLocationUser = req.body;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                if(isEmpty(dataLocationUser.currentLat) || isEmpty(dataLocationUser.currentLong)){
                    res.json({Status : 900, message: 'Missing parameters'})
                    
                }
                else{
                    const query = `update location set latitude = ?, longitude = ?
                    where id = (select currentLocation from user where id = ?)`  
                    mysqlConnection.query(query, [dataLocationUser.currentLat, dataLocationUser.currentLong, id], (err, rows, fields) => {
                        if(!err) {
                            console.log(rows);
                            if(rows.affectedRows > 0){
                                res.json({Status : 0, message: 'Location Updated'})        
                            }
                            else{
                                res.json({Status : 1, message: 'Could not update location'})
                            } 
                        }else {
                            res.json({Status : 1, message: 'Could not update location'})
                        }
                    });

                }
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }

        }
    })
})

//notify user emergency
router.post('/user/:id/emergency', ensureToken, (req,res) => {
    var token = req.token;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken

            
            if(returnedId.toString() == id){
                const query = ` insert into emergency(creation_date, user) values ((select current_timestamp), ?)`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);
                        if(rows.affectedRows > 0){
                            res.json({Status : 0, message: 'Emergency notified'})        
                        }
                        else{
                            res.json({Status : 1, message: 'Could not create notification'})
                        } 
                    }else {
                        res.json({Status : 1, message: 'Could not create notification'})
                    }
                });
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
   
})

//add prescription
router.post('/user/:id/prescription', ensureToken, (req,res) => {
    var token = req.token;
    dataMedicationAdd = req.body;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken

            
            if(returnedId.toString() == id){
                const query = ` insert into schedule (Dosage,takeEvery,totalDosis, startingOn,
                    notes, status, user, medication)
                    values (?,?,?,now(),?,1,?,?)`
                mysqlConnection.query(query, [dataMedicationAdd.dose,dataMedicationAdd.takeEvery,
                dataMedicationAdd.numberDosis, dataMedicationAdd.notes,
                id, dataMedicationAdd.medication], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);
                        if(rows.affectedRows > 0){
                            res.json({Status : 0, message: 'Prescription created'})        
                        }
                        else{
                            res.json({Status : 1, message: 'Could not create prescription'})
                        } 
                    }else {
                        console.log(err)
                        res.json({Status : 1, message: 'Could not create prescription'})
                    }
                });
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
   
})

//update user profile
router.put('/user/:id/', ensureToken, (req,res) => {
    var token = req.token;
    dataUserUpdate = req.body;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                if(isEmpty(dataUserUpdate.email) || isEmpty(dataUserUpdate.password) || isEmpty(dataUserUpdate.photo) || isEmpty(dataUserUpdate.name) ||        
                isEmpty(dataUserUpdate.lastname) || isEmpty(dataUserUpdate.phonenumber) || isEmpty(dataUserUpdate.genre) ||
                isEmpty(dataUserUpdate.dob)){
        
                    res.json({Status : 900, message: 'Missing parameters'})
                }
                else{
                    var concatInfo = dataUserUpdate.email + dataUserUpdate.password
                    const query = `update user set name = ?, lastName = ?, email = ?, password = (sha1(?)),
                    phoneNumber = ?, genre = ?, dateOfBirth = ?, photo = ?, token = (sha1('` + concatInfo + `'))
                     where id = ?` 
                     
                    
                     mysqlConnection.query(query, [dataUserUpdate.name, dataUserUpdate.lastname, dataUserUpdate.email,
                        dataUserUpdate.password, dataUserUpdate.phonenumber, dataUserUpdate.genre, dataUserUpdate.dob,
                        dataUserUpdate.photo, id], (err, rows, fields) => {
                            console.log(query)
                            if(!err) {
                                console.log(rows);
                                if(rows.affectedRows > 0){
                                    res.json({Status : 0, message: 'User Updated'})        
                                }
                                else{
                                    res.json({Status : 1, message: 'Could not update user'})
                                } 
                            }else {
                                console.log(err)
                                res.json({Status : 1, message: 'Could not update user'})
                            }
                    });
                }
               
                
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
            }
            
    
            
        }
    })
    
})

//add taken dosis
router.put('/user/:id/prescription/:idPresc/takenDosis', ensureToken, (req,res) => {
    var token = req.token;
    dataLocationUser = req.body;
    jwt.verify(req.token, 'secretkey', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            var idPresc = req.params.idPresc
            if(returnedId.toString() == id){
                const query = ` call addTakenDosis(?,?)`  
                mysqlConnection.query(query, [id, idPresc], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);
                        if(rows.affectedRows > 0){
                            res.json({Status : 0, message: 'Taken Dosis Updated'})        
                        }
                        else{
                            res.json({Status : 1, message: 'Could not update dosis'})
                        } 
                    }else {
                        console.log(err)
                        res.json({Status : 1, message: 'Could not update dosis'})
                    }
                });
            }
            else{
                res.json({Status : 1, message: 'User ID invalid'})
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

// function getIdByToken(token){
//     var value = 0;
//     jwt.verify(token, 'secretkey', (err, verifiedJwt) => {
//         console.log(verifiedJwt.userIdToken);
//         if(err){
            
//            value = 0;
          
//         }else{            
//             value = verifiedJwt.userIdToken;
//         }
//     })
//     return value;
// }

//check token aviability
function ensureToken(req,res,next){
    const bearerHeader = req.headers["authorization"]
    if(isEmpty(bearerHeader)){
        res.json({Status: 900, message: "Missing headers"})
    }
    else{
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
   
}







module.exports = router;