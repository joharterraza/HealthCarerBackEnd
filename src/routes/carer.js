const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database.js');

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



module.exports = router;