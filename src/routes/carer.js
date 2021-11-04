const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');
const jwt = require('jsonwebtoken');

function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

//ADD carer (post-raw-no autho)
router.post('/carer/', (req, res) => {
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

//Carer login (get-headers-no autho)
router.get('/carer/login/', (req,res) => {
    dataLogin = req.headers;
    
    if(isEmpty(dataLogin.email) || isEmpty(dataLogin.password)){
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
                    jwt.sign({userIdToken}, 'secretkeycarer', {expiresIn: 28800}, (err,token) =>{
                        
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

//Carer by id (get-si autho)
router.get('/carer/:id/', ensureToken, (req,res) => {
    var token = req.token;
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = ` select id,email, photo, name, lastName, phoneNumber,
                genre, dateOfBirth
                from healthcarer where id = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);                
                        var userArray = {}
                        
                        rows.forEach(r => {
                            userArray = {
                                id: r.id,
                                email: r.email,
                                photo: r.photo,
                                name: r.name,
                                lastName: r.lastName,
                                phoneNumber: r.phoneNumber,                           
                                gender: r.genre,
                                dob: r.dateOfBirth,
                               
                            }
                        })
                       
                        
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

//Patients carer (get- si autho)
router.get('/carer/:id/patients', ensureToken, (req,res) => {
    
    var token = req.token;
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = `  select id,email, photo, name, lastName, phoneNumber, token as pairingToken, 
                genre, dateOfBirth from user where healtcarer = ?`
                mysqlConnection.query(query, [id], (err, rows, fields) => {
                    if(!err) {
                        var patientsArray = []
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            patientsJson = {Status: 0, patients: patientsArray}
                            res.json(patientsJson)
                                                  
                        }
                        else{                   
                            rows.forEach(r => {
                               
                                patientsArray.push({
                                    id: r.id,
                                    email: r.email,
                                    photo: r.photo,
                                    name: r.name,
                                    lastName: r.lastName,
                                    phoneNumber: r.phonenumber,
                                    gender: r.genre,
                                    dob: r.dateOfBirth,
                                    pairingToken: r.pairingToken,
                                    
                                })
                            });
                            patientsJson = {Status: 0, patients: patientsArray}
                            res.json(patientsJson)
                                                
                        
                            
                            
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

//get patient by id (get - si autho)
router.get('/carer/:id/patient/:idPatient', ensureToken, (req,res) => {
    
    var token = req.token;
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var idPatient = req.params.idPatient;
            var returnedId = verifiedJwt.userIdToken
            if(returnedId.toString() == id){
                const query = `  select id,email, photo, name, lastName, phoneNumber, token as pairingToken, 
                genre, dateOfBirth from user where healtcarer = ? and id = ?`
                mysqlConnection.query(query, [id, idPatient], (err, rows, fields) => {
                    if(!err) {
                        var patientsArray = {}
                        console.log(rows);                
                        if(rows.length == 0){
                            
                            patientsJson = {Status: 0, patients: patientsArray}
                            res.json(patientsJson)
                                                  
                        }
                        else{                   
                            rows.forEach(r => {
                               
                                patientsArray = {
                                    id: r.id,
                                    email: r.email,
                                    photo: r.photo,
                                    name: r.name,
                                    lastName: r.lastName,
                                    phoneNumber: r.phonenumber,
                                    gender: r.genre,
                                    dob: r.dateOfBirth,
                                    pairingToken: r.pairingToken,
                                    
                                }
                            });
                            patientsJson = {Status: 0, patient: patientsArray}
                            res.json(patientsJson)
                                                
                        
                            
                            
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

//update user carer (put - raw- si autho)
router.put('/carer/addPatient', ensureToken, (req,res) => {
    
    var token = req.token;
    var pairingToken = req.body.pairingToken
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{    
            if(isEmpty(pairingToken)){
                res.json({Status : 900, message: 'Missing parameters'})
            }      
            else{
                var idCarer = verifiedJwt.userIdToken
                const query = ` update user set healtCarer = ? where id = (select id from user where token = ?)`
                mysqlConnection.query(query, [idCarer, pairingToken], (err, rows, fields) => {
                    if(!err) {
                        console.log(rows);
                        if(rows.affectedRows > 0){
                            res.json({Status : 0, mensaje: 'Carer updated'})        
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
           
    
            
        }
    })
    
})

//update carer profile (put - raw- si autho)
router.put('/carer/:id/', ensureToken, (req,res) => {
    var token = req.token;
    dataUserUpdate = req.body;
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
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
                    
                    const query = `update healthcarer set name = ?, lastName = ?, email = ?, password = (sha1(?)),
                    phoneNumber = ?, genre = ?, dateOfBirth = ?, photo = ? where id = ?` 
                     
                    
                     mysqlConnection.query(query, [dataUserUpdate.name, dataUserUpdate.lastname, dataUserUpdate.email,
                        dataUserUpdate.password, dataUserUpdate.phonenumber, dataUserUpdate.genre, dataUserUpdate.dob,
                        dataUserUpdate.photo, id], (err, rows, fields) => {
                            console.log(query)
                            if(!err) {
                                console.log(rows);
                                if(rows.affectedRows > 0){
                                    res.json({Status : 0, message: 'Carer Updated'})        
                                }
                                else{
                                    res.json({Status : 1, message: 'Could not update carer'})
                                } 
                            }else {
                                console.log(err)
                                res.json({Status : 1, message: 'Could not update carer'})
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

//add prescription to user (post - raw - si autho)
router.post('/carer/:id/addprescription/:idUser', ensureToken, (req,res) => {
    var token = req.token;
    dataMedicationAdd = req.body;
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
        if(err){
            res.json({Status: 2, message: "Invalid Token"})
          
        }else{          
            var id = req.params.id;
            var idUser = req.params.idUser
            var returnedId = verifiedJwt.userIdToken

            
            if(returnedId.toString() == id){
                const query = ` insert into schedule (Dosage,takeEvery,totalDosis, startingOn,
                    notes, status, user, medication)
                    values (?,?,?,?,?,1,?,?)`
                mysqlConnection.query(query, [dataMedicationAdd.dose,dataMedicationAdd.takeEvery,
                dataMedicationAdd.numberDosis, dataMedicationAdd.startingOn, dataMedicationAdd.notes,
                idUser, dataMedicationAdd.medication], (err, rows, fields) => {
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








// function getIdByToken(token){
//     var value = 0;
//     jwt.verify(token, 'secretkeycarer', (err, verifiedJwt) => {
//         console.log(verifiedJwt.userIdToken);
//         if(err){
            
//            value = 0;
          
//         }else{            
//             value = verifiedJwt.userIdToken;
//         }
//     })
//     return value;
// }

//test token
router.get('/verify/carer', ensureToken, (req, res) => {
   
    
    jwt.verify(req.token, 'secretkeycarer', (err, verifiedJwt) => {
    if(err){
        res.json({Status: 2, message: "Invalid Token"})
      
    }else{
      res.json(verifiedJwt)
    }
  })
})


//Test header
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